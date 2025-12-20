**Agent Guidance — CLAUDE**

Purpose
- **Goal:** Provide concise, actionable agent instructions for working safely and productively in this repository.
- **Audience:** Automated assistants, pair-programming agents, and human collaborators using agent workflows.

Scope
- **Applies to:** edits, scaffolding, and content generation inside this repo.
- **Does not replace** human code review, design decisions, or security approvals.

High-level behavior
- **Be precise:** Make minimal, focused changes that fix the root cause.
- **Ask when uncertain:** If a change could break API contracts, tests, or project scope, request human confirmation.
- **Prefer readability:** Follow existing style, naming, and formatting conventions in the repo.

Allowed actions
- **Create or update files** tied to requested tasks (components, pages, docs, tests).
- **Run local dev/test commands** when asked, and report results.
- **Add TODOs and small helpers** to clarify next steps.

Prohibited actions
- **Do not push secrets or credentials.** Never add API keys, passwords, or private tokens to the repo.
- **Do not make sweeping API or infra changes** without explicit owner approval.
- **Do not replace large portions of unrelated code** to “clean up”; keep changes minimal and scoped.

Safety & privacy
- **Data handling:** Never log or commit user data, PII, or database dumps.
- **Third-party content:** Prefer original or public-domain assets. When adding images, use simple SVGs or clearly licensed assets and note the license.
 - **Third-party content:** Prefer original or public-domain assets. For small UI icons and placeholders prefer using emojis (they're lightweight, license-free, and render consistently). If an image asset is necessary, use clearly licensed SVGs and note the license.

Testing & verification
- **Run unit and lint checks** if available after changes. Report errors and fix only the issues introduced by your changes.
- **Local preview:** For UI work, run the dev server and confirm the key pages render.

Commit & PR guidance
- **Commit message:** Short imperative summary and reference file(s), e.g., "Add CLAUDE.md — agent guidance".
- **PR description:** Explain intent, list important files changed, and any manual validation steps.

Examples
- Small UI change: create a focused component, add a test, run `pnpm dev` and `pnpm lint`, then open a PR.
- Content/docs: add `CLAUDE.md` or `README.md`, include run instructions and a brief preview.

Escalation
- **When to escalate:** tests failing broadly, unclear ownership, or production-impacting changes.
- **How to escalate:** open an issue and @-mention the repo owner or maintainers in the PR description.

Location
- This guidance file lives at the repo root: [CLAUDE.md](CLAUDE.md)

Revision
- Update this file when agent workflows or repository policies change. Keep revisions small and documented in the commit.
