# Claude Agent Notes

## CoachOS Lanes

When working with CoachOS, observe lane boundaries:

### Coding Lane (Grok CLI)
- Code changes, tests, dependencies
- Build and local verification
- Hand off to ops lane for deployment

### Ops Lane (CoachOS Grok Bot.app)
- Deployment, rollback
- Monitoring, alerting
- Incident response

## Protocol

1. Start session → `brief.md`
2. Work in assigned lane
3. End session → `wrapup.md`

Cross-lane work requires explicit handoff via wrapup → brief sequence.

See [DESK.md](./DESK.md) for complete protocol.

## Guidelines

- Do NOT deploy from coding lane
- Do NOT write code from ops lane
- Use existing patterns only
- No invented agents or actions
