# CoachOS Agents

## Lane Assignments

CoachOS uses a two-lane operator-desk model:

### Coding Lane
- **Agent:** Grok CLI
- **Scope:** Code changes, dependencies, build, test
- **Entry:** brief.md
- **Exit:** wrapup.md → handoff to ops if deploy needed

### Ops Lane
- **Agent:** CoachOS Grok Bot.app
- **Scope:** Deployment, monitoring, incident response
- **Entry:** brief.md (from coding lane handoff)
- **Exit:** wrapup.md

## Coordination Protocol

See [DESK.md](./DESK.md) for full handshake protocol.

## Lane Boundaries

- Coding does NOT deploy or monitor production
- Ops does NOT write application code
- In-product / self-heal only if already present
- No invented agents
