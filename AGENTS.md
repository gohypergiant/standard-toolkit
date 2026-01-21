# Agent Guidelines

Build production-quality, safety-critical code. This document defines the coding philosophy, workflow, and standards for this repository.

Read the [AI Assistant Guide](.agents/outline.md) and all linked pages before proceeding.

## About This Repository

This codebase follows **HyperStyle**—our internal style guide prioritizing **safety, performance, and developer experience** in that order. We build software for critical systems where correctness is non-negotiable.

> Simplicity is the prerequisite for reliability.
> — Edsger W. Dijkstra

**Zero technical debt**: Do it right the first time.

## Agent Capabilities

These guidelines assume you can:
- Explore and modify the codebase
- Spawn parallel agents for independent tasks (if supported)
- Use extended thinking for complex architectural decisions
- Perform file system and git operations

## Workflow: Research → Plan → Implement

Follow this sequence for every task:

1. **Research**: Explore the codebase, understand existing patterns
2. **Plan**: Create a detailed implementation plan; verify with the user
3. **Implement**: Execute with validation checkpoints

Say: "Let me research the codebase and create a plan before implementing."

For complex architectural decisions, say: "Let me think through this architecture before proposing a solution" (then engage extended thinking).

If your environment supports MCP (Model Context Protocol) servers:
- Use [Context7 MCP](https://context7.com/) for library/API documentation, code generation, and setup instructions

If MCP is not available, search web documentation or ask user for guidance on library-specific patterns.

### When Stuck

1. **Stop** — Don't spiral into complex solutions
2. **Delegate** — Spawn agents for parallel investigation (if supported)
3. **Think deeply** — Use extended thinking for architectural problems
4. **Simplify** — The simple solution is usually correct
5. **Ask** — "I see two approaches: [A] vs [B]. Which do you prefer?"

### Validation Checkpoints

Stop and validate at these moments:
- After implementing a complete feature
- Before starting a new major component
- When something feels wrong
- Before declaring "done"

## Conversation Style

- Answer questions directly without editing code
- Criticize ideas constructively; ask clarifying questions
- No compliments, apologies, or filler phrases ("You're right", "Let me explain")
- Get to the point immediately

## Working Memory

When context gets long:

1. Re-read this AGENTS.md file
2. Summarize progress in PROGRESS.md (create if needed)
3. Document current state before major changes

Maintain TODO.md with this structure (create if needed):

```markdown
## Current Task
<what you're working on>

## Completed
- [x] Task 1
- [x] Task 2

## Next Steps
- [ ] Task 3
- [ ] Task 4
```

## Quality Requirements

IMPORTANT: Before ANY commit, run these commands in order:

```bash
pnpm run build
pnpm run test
pnpm run lint
pnpm run format
```

All must pass. No exceptions.

## Git & Versioning

**Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/)
- `feat:` New features
- `fix:` Bug fixes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `docs:` Documentation
- `chore:` Maintenance tasks

**Changesets**: Required for version bumps
- Run `pnpm changeset` to document changes
- Describe user-facing changes clearly
- Choose appropriate semver bump (major/minor/patch)

## Important Reminders

- NO time estimates or predictions
- NO unnecessary comments/docstrings on unchanged code
- NO backwards-compatibility hacks for unused code
- NO feature flags or premature configurability
- Delete unused code completely, don't comment it out

## Common Patterns

**Finding code**:
- Use Explore agent for codebase orientation
- Check existing patterns before implementing new ones
- Look for similar functionality in other packages

**Package dependencies**:
- Internal packages use `workspace:*` protocol
- Run `pnpm run lint:deps` to verify correct semver ranges
