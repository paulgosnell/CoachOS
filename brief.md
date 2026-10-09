# Session brief: CoachOS

Runs automatically at the start of every session (the global brief skill reads this file first). /brief also works as a backup.
CLAUDE.md, the rules and MEMORY.md are already loaded: do not re-read or summarise them.

## Steps
1. Remote drift: `git fetch origin`, then `git diff --stat HEAD..origin/main -- tasks.md DESK.md`. If it differs, fast-forward pull. The tracker file is lowercase `tasks.md`.
2. tasks.md (session log, newest at top): read only the newest one or two session blocks and the open `[ ]` items under Current Sprint.
3. DESK.md (live board, about 60 lines): read both Now blocks, Asks and "Self-heal needs operator". Note whether the other lane has claimed files you need and any Ask aimed at your lane.
4. Lane, from how you were launched: Grok CLI is coding, CoachOS Grok Bot.app is ops. Coach in the product: stop, DESK.md is not for it. The self-heal Action never edits DESK.md. A Claude Code session takes the lane that matches the work: coding for product code, ops for deploy, monitoring and Paul-side CS.
5. Claim: when the session will change files or config, edit only your own lane's Now block in DESK.md (Status, Claimed, Do not touch), then commit and push so the other lane can see it. Never rewrite another lane's Now block.
6. Backlog is GitHub Issues, not tasks.md. Query live, the DESK.md self-heal note is a sticky only: `gh issue list --repo paulgosnell/CoachOS --state open --limit 10`. There is no fixer Action in this repo.
7. Lane rules: work within the assigned lane only. Do NOT deploy from the coding lane. Do NOT write code from the ops lane. No cross-lane action without an explicit handoff (wrapup, then brief). Use existing patterns only. No invented agents or actions.
8. Ops lane only: check the weekday morning check routine `coachos-weekday-morning` (8:44 London, weekdays) has run and is confirmed in Routines.

## Output
3 to 5 lines: "Ready on CoachOS. Last session: <one line>." then open items that matter, then only flags that are true (drift pulled, lane claimed by the other side, an Ask for your lane, open GitHub issues, auth to re-authorise). No gotcha lists, no tool lists, no project description.
