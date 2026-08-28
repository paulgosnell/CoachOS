# Operator-Desk Handshake

## Protocol

This document defines the handshake protocol between operator lanes in CoachOS.

## Lanes

| Lane | Agent | Scope |
|------|-------|-------|
| `coding` | Grok CLI | Code changes, dependencies, build, test |
| `ops` | CoachOS Grok Bot.app | Deployment, monitoring, incident response |

## Handshake Sequence

1. **brief.md** — Session opens with context and objectives
2. **Work** — Agent executes in assigned lane
3. **wrapup.md** — Session closes with outcomes and handoff notes

## Lane Boundaries

- Coding lane does NOT deploy or monitor production
- Ops lane does NOT write application code
- In-product / self-heal only if already present in codebase
- No invented agents (Finn, fixer Actions, etc.)

## Coordination

When work crosses lanes:
1. Complete current lane work
2. Document handoff in wrapup.md
3. Next session picks up via brief.md

## Session Files

- `brief.md` — Created at session start
- `wrapup.md` — Created at session end
- Both are ephemeral; commit if needed for continuity
