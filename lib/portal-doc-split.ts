import { randomUUID } from "node:crypto";
import { generateObject, jsonSchema } from "ai";
import { PDFDocument } from "pdf-lib";
import { extractText } from "unpdf";
import { createAdminClient } from "@/lib/supabase/admin";
import { DOCUMENT_BUCKET, PortalProblem } from "@/lib/portal-contract";

// Carrier packets are frequently scanned/merged into a single PDF (agreement +
// COI + W9 + factoring NOA). This module pulls per-page text, asks the model to
// group contiguous pages into the recognised carrier document kinds, then emits
// one clean PDF per detected document and records each against the carrier.

// Kinds a split segment may map to. These must all be accepted by the
// fn_documents.kind check constraint.
const SPLIT_KINDS = ["packet", "coi", "w9", "noa", "other"] as const;
type SplitKind = (typeof SPLIT_KINDS)[number];

const KIND_LABEL: Record<SplitKind, string> = {
  packet: "Carrier packet / agreement",
  coi: "Certificate of insurance (COI)",
  w9: "W-9",
  noa: "Notice of assignment (NOA)",
  other: "Other document",
};

// Cap the work we hand the model and pdf-lib so a pathological upload cannot
// pin the function. 60 pages comfortably covers a real carrier packet.
const MAX_PAGES = 60;
const PER_PAGE_CHARS = 1400;

type RawSegment = {
  kind: string;
  startPage: number;
  endPage: number;
  title?: string;
};

const segmentSchema = jsonSchema<{ segments: RawSegment[] }>({
  type: "object",
  additionalProperties: false,
  required: ["segments"],
  properties: {
    segments: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["kind", "startPage", "endPage", "title"],
        properties: {
          kind: { type: "string", enum: [...SPLIT_KINDS] },
          startPage: { type: "integer", minimum: 1 },
          endPage: { type: "integer", minimum: 1 },
          title: { type: "string" },
        },
      },
    },
  },
});

export type SplitResult = { kind: SplitKind; label: string; pages: number };

function normalise(
  segments: RawSegment[],
  totalPages: number,
): { kind: SplitKind; startPage: number; endPage: number }[] {
  const clamped = segments
    .map((s) => {
      const kind = (SPLIT_KINDS as readonly string[]).includes(s.kind)
        ? (s.kind as SplitKind)
        : "other";
      let startPage = Math.max(1, Math.min(totalPages, Math.floor(s.startPage)));
      let endPage = Math.max(1, Math.min(totalPages, Math.floor(s.endPage)));
      if (endPage < startPage) [startPage, endPage] = [endPage, startPage];
      return { kind, startPage, endPage };
    })
    .sort((a, b) => a.startPage - b.startPage);

  // Drop ranges that overlap an already-accepted one so every source page is
  // copied into at most one segment.
  const accepted: { kind: SplitKind; startPage: number; endPage: number }[] = [];
  let covered = 0;
  for (const seg of clamped) {
    if (seg.startPage <= covered) {
      if (seg.endPage <= covered) continue;
      seg.startPage = covered + 1;
    }
    accepted.push(seg);
    covered = seg.endPage;
  }
  return accepted;
}

export async function splitCarrierPacket(
  userId: string,
  path: string,
): Promise<SplitResult[]> {
  const db = createAdminClient();

  const download = await db.storage.from(DOCUMENT_BUCKET).download(path);
  if (download.error || !download.data)
    throw new PortalProblem("Could not open the uploaded PDF.", 502);
  const bytes = new Uint8Array(await download.data.arrayBuffer());

  // pdf.js detaches the buffer it reads, so give the extractor its own copy and
  // keep the original bytes for pdf-lib.
  const { totalPages, text: pages } = await extractText(bytes.slice(), {
    mergePages: false,
  });
  if (!totalPages || totalPages < 1)
    throw new PortalProblem("That PDF has no readable pages.", 422);
  if (totalPages > MAX_PAGES)
    throw new PortalProblem(
      `That PDF has ${totalPages} pages. Split files of ${MAX_PAGES} pages or fewer.`,
      422,
    );

  const snippets = pages
    .map(
      (page, index) =>
        `--- PAGE ${index + 1} ---\n${(page || "(no extractable text)").slice(0, PER_PAGE_CHARS)}`,
    )
    .join("\n\n");

  const { object } = await generateObject({
    model: "openai/gpt-4.1-mini",
    schema: segmentSchema,
    system:
      "You organise a scanned freight carrier packet PDF into its separate documents. " +
      "Group CONTIGUOUS pages into segments and classify each. Kinds: " +
      "coi = ACORD certificate of liability insurance; " +
      "w9 = IRS Form W-9 request for taxpayer identification; " +
      "noa = notice of assignment or factoring/payment-assignment letter; " +
      "packet = carrier or broker agreement, authority, MC/DOT, references, general setup; " +
      "other = anything that fits none of these. " +
      "Cover every page from 1 to the total exactly once with non-overlapping ranges in page order.",
    prompt: `The PDF has ${totalPages} page(s). Return the segments that cover pages 1 through ${totalPages}.\n\n${snippets}`,
  });

  const segments = normalise(object.segments || [], totalPages);
  if (segments.length === 0)
    throw new PortalProblem(
      "Could not detect separate documents in that PDF.",
      422,
    );

  const source = await PDFDocument.load(bytes);
  const created: SplitResult[] = [];

  for (const seg of segments) {
    const out = await PDFDocument.create();
    const indices: number[] = [];
    for (let p = seg.startPage; p <= seg.endPage; p += 1) indices.push(p - 1);
    const copied = await out.copyPages(source, indices);
    copied.forEach((page) => out.addPage(page));
    const outBytes = await out.save();

    const name = `${seg.kind}-p${seg.startPage}-${seg.endPage}.pdf`;
    const segPath = `${userId}/${randomUUID()}/${name}`;
    const uploaded = await db.storage
      .from(DOCUMENT_BUCKET)
      .upload(segPath, new Blob([outBytes], { type: "application/pdf" }), {
        contentType: "application/pdf",
        upsert: false,
      });
    if (uploaded.error)
      throw new PortalProblem("Could not save a split document.", 503);

    const saved = await db.rpc("fn_add_document", {
      p_user: userId,
      p_kind: seg.kind,
      p_path: segPath,
      p_name: name,
    });
    if (saved.error) {
      await db.storage.from(DOCUMENT_BUCKET).remove([segPath]);
      throw new PortalProblem("Could not record a split document.", 503);
    }

    created.push({
      kind: seg.kind,
      label: KIND_LABEL[seg.kind],
      pages: indices.length,
    });
  }

  // The combined upload has been fully replaced by the per-document files;
  // remove it so the carrier is not left with an unclassified duplicate.
  await db.storage.from(DOCUMENT_BUCKET).remove([path]);
  return created;
}
