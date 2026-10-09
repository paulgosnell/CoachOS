# Session wrap-up: CoachOS

Runs automatically when a piece of work finishes (global rule + wrapup skill). /wrapup also works as a safety net. Do only what is not already done.

## Steps (skip any already done or not applicable)
1. Deploy check: a commit is not a deploy. Vercel builds from GitHub `main` (`paulgosnell/CoachOS`). Poll until the deployment is Ready, then load the changed page on https://ceocoachos.com the way a user sees it. Skip if only docs changed. If this session changed `supabase/functions/revolut-webhook-handler` (or a file it imports), compare `npx supabase functions list` with the latest commit touching it (3 hour tolerance, CLI is UTC). If stale, run `npx supabase functions deploy revolut-webhook-handler` and keep its current verify_jwt setting. The coding lane does NOT deploy: leave an Ask on DESK.md for ops instead.
2. Record the session in `tasks.md` (lowercase, newest at top): a new block `## YYYY-MM-DD - <lane>`, one line per item done, still open or blocked. Backlog stays in GitHub Issues: file new work with `gh issue create --repo paulgosnell/CoachOS`, not in tasks.md.
3. Memory: durable lessons only (corrections, gotchas that will recur, standing rules). No task status.
4. Release the desk: in DESK.md edit only your own lane's Now block (Status idle, Claimed none, Do not touch none). Delete the Asks you finished. If the next piece of work belongs to the other lane, add one Ask line from your lane to theirs, and put "Next lane: coding / ops / none" plus the artifacts (commits, logs, config changes) in the tasks.md block. Keep DESK.md under about 60 lines. Never rewrite another lane's Now block.
5. Commit and push the docs, staged by name (never `git add -A`): `DESK.md`, `tasks.md` and anything else touched. Message `docs: session wrap-up YYYY-MM-DD`. Push matters here because the other lane reads DESK.md from GitHub. Check `git log origin/main -1` shows it. If the push fails, say "committed, not pushed".

## Output
The done line only:
- Goal: <what this session set out to do>.
- Status: <done / live / tested, or exactly what is not>.
- Waiting on you: <items, one line each, or "nothing">.
