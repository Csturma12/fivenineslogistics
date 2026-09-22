import { timingSafeEqual } from "node:crypto";
import { PortalProblem } from "./portal-contract";

export function requireBridgeToken(request: Request, token: string | undefined) {
  if (!token || token.length < 32) throw new PortalProblem("Portal bridge is not configured.", 503);
  const authorization = request.headers.get("authorization") || "";
  const provided = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const expected = Buffer.from(token), actual = Buffer.from(provided);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    throw new PortalProblem("Unauthorized.", 401);
}
