# Agent Guidelines

This file is loaded into every Agent session. Keep it accurate and current.
**After any correction from a user, update this file (AGENTS.md) with a rule that prevents the same mistake.**

Read the [AI Assistant Guide](.agents/outline.md) and all linked pages before proceeding.

## Tech Stack

**For exact versions and dependencies, refer to `./package.json` in the following fields:**
- `engines` - Node and pnpm version requirements
- `devDependencies` - Build tools, linters, testing frameworks
- `packageManager` - Package manager specification

Key technologies:
- **Package Manager**: pnpm (see `packageManager` field)
- **Node**: See `engines.node` field
- **Build Tool**: Turbo (monorepo orchestration)
- **Linter/Formatter**: Biome
- **Testing**: Vitest
- **Versioning**: Changesets
- **Language**: TypeScript (strict mode)
- **Frameworks**: React, Next.js

## Essential Commands

**All available commands are defined in the root `package.json` under the `scripts` field.** Key commands include:

```bash
# Development
pnpm build                 # Build all packages
pnpm test                  # Run all tests
pnpm lint                  # Lint all code
pnpm format                # Format all code
pnpm index                 # Generate main entry exports

# Cleaning (use when things break)
pnpm clean                 # Clean everything recursively (nuclear option)
pnpm clean:deps            # Remove node_modules recursively
pnpm clean:dist            # Clean tsdown build directories recursively
pnpm clean:turbo           # Clean turborepo cache directories recursively

# Version management (changesets)
pnpm changeset             # Create a new changeset
pnpm changeset:version     # Version packages from changesets
pnpm changeset:release     # Build and publish to npm

# Linting
pnpm run lint              # Lint code
pnpm run lint:deps         # Lint dependencies with syncpack
pnpm run lint:fs           # Lint file system with ls-lint
pnpm run lint:package.     # Lint package.json with syncpack
pnpm run lint:rac          # Lint react-aria-components and @react-aria/* package versions
```

## Verification Gate

Run these in order after **every** change. Do not declare a task complete until all pass.

```bash
pnpm run build    # Fix type errors first; confirm the build succeeds
pnpm run test     # Fix failing tests
pnpm run lint     # Fix lint errors
pnpm run format   # Fix formatting errors
```

## Core Principles

- **Simplicity First** — Make every change as small as possible. Minimal code impact.
- **Root Causes** — Fix root causes, not symptoms. No temporary patches.
- **Verification** — Never mark a task complete without passing the Verification Gate above.

## Skills

**Before using training data, evaluate and apply ALL APPLICABLE SKILLS. Only fall back to training data if no skill applies. This is mandatory.**

| Skill | Apply When |
|---|---|
| `accelint-ts-best-practices` | Writing TS/JS, fixing type errors, adding validation, code review |
| `accelint-ts-performance` | Code is slow, profiling shows bottlenecks, optimizing hot paths |
| `accelint-ts-testing` | Writing `*.test.ts` files, adding coverage, debugging flaky tests |
| `accelint-ts-documentation` | Adding JSDoc, TODO/FIXME markers, doc quality review |
| `accelint-react-best-practices` | Writing components, debugging re-renders, fixing hydration errors |
| `accelint-react-testing` | React Testing Library tests, component test patterns |
| `accelint-nextjs-best-practices` | Server Actions, RSC patterns, waterfall elimination, API routes, caching |
| `accelint-security-best-practices` | Security audit, auth/authz, handling user input, pre-deploy review |

## Workflows

- **Plan First** — Enter plan mode for any task involving 3+ steps or an architectural decision. Re-plan if the path breaks.
- **Subagents** — Use subagents for research, exploration, and parallel analysis. One focused task per subagent.
- **Self-Improvement** — After any correction from the user, update this file (AGENTS.md) with a specific, actionable rule.
- **API Verification** — Use [Context7 MCP](https://context7.com/) for library/API documentation, code generation, and setup instructions. If Context7 is not available search web documentation or ask user for guidance on library-specific patterns, assume your knowledge is stale.

## Conversation Style

- Answer questions directly without editing code
- Criticize ideas constructively; ask clarifying questions
- No compliments, apologies, or filler phrases ("You're right", "Let me explain")
- Get to the point immediately

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

A changeset is only required if internal source code is changed (usually within a `src/` directory). Examples of when NOT to create a changeset:
- Adding/modifying code comments
- Adding/modifying markdown documentation
- Adding/modifying Storybook code
- Adding/modifying tests
