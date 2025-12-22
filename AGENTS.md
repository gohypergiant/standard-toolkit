# Agent Guidelines

Build production-quality, safety-critical code. This document defines the coding philosophy, workflow, and standards for this repository. When in doubt, use the documented patterns and follow the rules strictly.

Read the [AI Assistant Guide](./0.outline.md) and all linked pages before proceeding.

## Philosophy

**HyperStyle** prioritizes **safety, performance, and developer experience**—in that order. We build software for critical systems where correctness is non-negotiable. Zero technical debt: do it right the first time.

> Simplicity is the prerequisite for reliability.  
> — Edsger W. Dijkstra

## Conversation Style

- Answer questions directly without editing code
- Criticize ideas constructively; ask clarifying questions
- No compliments, apologies, or filler phrases ("You're right", "Let me explain")
- Get to the point immediately

## Workflow: Research → Plan → Implement

Follow this sequence for every task:

1. **Research**: Explore the codebase, understand existing patterns
2. **Plan**: Create a detailed implementation plan; verify with the user
3. **Implement**: Execute with validation checkpoints

Say: "Let me research the codebase and create a plan before implementing."

For complex architectural decisions, use **ultrathink**: "Let me ultrathink about this architecture before proposing a solution."

### When Stuck

1. **Stop** — Don't spiral into complex solutions
2. **Delegate** — Spawn agents for parallel investigation
3. **Ultrathink** — Engage maximum reasoning capacity
4. **Simplify** — The simple solution is usually correct
5. **Ask** — "I see two approaches: [A] vs [B]. Which do you prefer?"

### Reality Checkpoints

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
2. Summarize progress in PROGRESS.md
3. Document current state before major changes

Maintain TODO.md structure:

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

## Git Instructions

- Commits should follow the conventional commit format: https://www.conventionalcommits.org/en/v1.0.0/#specification

## Pull Request Instructions

- Title format: <fix|feat|build|chore|ci|docs|style|refactor|perf|test>: <short description>
- Always run `pnpm run build`, `pnpm run test`, `pnpm run lint`, and `pnpm run format` before committing.
