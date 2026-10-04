<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Codex operating mode

Optimize for the smallest correct change and the smallest useful context.

## Default workflow
1. Start from the files, route, component, error, or feature named in the task.
2. Read only direct dependencies needed to understand or implement the change.
3. Reuse existing patterns instead of redesigning architecture.
4. Make the smallest change that satisfies the stated requirements.
5. Run targeted validation for the changed area.
6. Summarize what changed, what was verified, and any remaining blocker.

## Do not do by default
- Do not perform a repository-wide audit or scan.
- Do not enumerate every branch or pull request unless the task specifically depends on prior work.
- Do not trace unrelated data paths.
- Do not investigate unrelated warnings, lint findings, or failing tests.
- Do not refactor unrelated code.
- Do not repeatedly rerun checks that already passed.
- Do not inspect CI or PR history unless local targeted validation fails or the task explicitly requires it.
- Do not expand scope merely because another issue is discovered.

## Verification
Prefer the narrowest relevant test, typecheck, or build target first.
Escalate to a broader check only when the changed area has no targeted validation, a failure suggests wider impact, or the task explicitly requires it.
Do not run the same successful verification more than once unless code changed afterward.

## Stop conditions
Stop and report instead of expanding scope if:
- a production configuration or deployment change is required;
- an unexpected database/schema migration is required;
- authentication/authorization architecture must change;
- completing the task requires a substantial unrelated refactor;
- an existing active branch or PR appears to already implement the same change;
- a blocker cannot be resolved within the files directly related to the task.

## Git and deployment safety
Do not merge, deploy, or change production configuration unless the current task explicitly authorizes it.
Keep unrelated changes out of the working branch.
