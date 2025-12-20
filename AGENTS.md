# Agent Guidelines

## When using Design Toolkit

1. Read the [AI Assistant Guide](./0.outline.md) and linked pages first.
2. Build production-quality, safety-critical code. This repository prioritizes **safety, performance, and developer experience**—in that order.
3. Only use icons from `@accelint/icons`.
4. Prefer deep path imports e.g. `import { Button } from '@accelint/components/button';`. You can find these in the `package.json` `exports` field in every workspace package.
5. Check component props via typescript definitions (`package.json#types`) and examples via Storybook (`**/**.docs.mdx`) documentation before using.

## Git instructions

- Commits should follow the conventional commit format: https://www.conventionalcommits.org/en/v1.0.0/#specification

## PR instructions

- Title format: <fix|feat|build|chore|ci|docs|style|refactor|perf|test>: <short description>
- Always run `pnpm run build`, `pnpm run test`, `pnpm run lint`, and `pnpm run format` before committing.

---

Use this quote as a guiding principle for design:

> Simplicity is the prerequisite for reliability.
> — Edsger W. Dijkstra
