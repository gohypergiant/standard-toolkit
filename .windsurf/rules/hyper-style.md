---
trigger: always_on
---

# General Code Style & Formatting
- Treat all warnings as errors; use strictest compiler/linter settings.
- Use Linux line endings (`\n`) in all code.
- Prioritize safety, performance, and developer experience—in that order.
- Aim for zero technical debt: do it right the first time.
- Design for simplicity and reliability from the start.

# Naming Conventions
- Use descriptive, meaningful names for variables, functions, and files.
- Use complete words unless abbreviation is widely recognized (e.g., `ID`, `URL`, `RCS`).
- Append units or qualifiers in descending order of significance: `latencyMsMax` not `maxLatencyMs`.
- Prefix Boolean variables with `is` or `has`: `isVisible`, `hasChildren` not `visible`, `children`.
- Avoid context-dependent or ambiguous names (`data`, `temp`, `n`, `a`).

# Functions & Logic
- Keep functions concise: under 50 lines.
- Use simple, clear control flow; avoid deep nesting: prefer `if (!condition1) return result1;` over nested if/else.
- Prefer early returns over nested conditionals.
- Avoid recursion when possible; use bounded loops instead.
- Keep leaf functions pure (no side effects, deterministic output).
- Limit function parameters; prefer simple return types.
- **Never use default parameters**—make all parameters explicit at call site: `getPosition(330)` not `getPosition()`.
- Always return zero values (identity elements) instead of `null` or `undefined`: return `[]` not `undefined`.
- Never mutate passed references; create copies instead: `const tmp = { ...config, left: 70 }` not `config.left = 70`.
- Use the function keyword for pure functions.
- Use arrow functions for simple cases (<3 instructions), named functions otherwise.

# Control Flow & Limits
- Set upper bounds on all loops, queues, and data structures: `for (const item of items)` not `while (true)`.
- Use bounded iterations; avoid unbounded `while(true)` loops.
- Centralize state manipulation in parent function; use helper functions to compute changes.

# Data Handling
- Always validate and sanitize user inputs: use `z.object()` schemas with `safeParse()`.
- Handle all errors explicitly—never ignore errors.
- Test error handling code thoroughly: negative testing, fault injection, recovery testing, error guessing.

# State Management & Logic
- Use `const` instead of `let` whenever possible: `const color = rawColor.replace(/\s/g, '')` not `let color = ...; color = ...`.
- Declare variables at smallest possible scope.
- Minimize number of variables in scope.
- Avoid duplicate variables or unnecessary aliases.
- Prefer immutability; avoid side effects.

# Assertions
- Use assertions to detect programmer errors: `assert(condition, message)` throws on failure.
- Split compound assertions for clarity: `assert(a); assert(b);` not `assert(a && b)`.
- Verify both positive space (what you expect) and negative space (what you don't expect): `assert(width > 0, ...)`.
- Include descriptive error messages with variable values: `Index out of bounds: index=${index}, items.length=${items.length}`.

# Error Messages
- For users: be clear, empathetic, and actionable: "We're having trouble connecting" not "Error 500".
- For developers: be specific, include values, explain assumptions: `Expected 'count' to be a number, but got type '${typeof count}'`.

# TypeScript
- Avoid any and enums; use explicit types and maps instead.
- Always provide a correct return type.
- Avoid using any.

# Performance
- Design for performance from the start.
- Optimize slowest resources first: **network >> disk >> memory >> CPU**.
- Consider frequency of usage when optimizing.
- Batch operations to amortize costly processes.
- Write code with predictable execution paths for better CPU caching.
- Use memoization only when appropriate: avoid memoizing trivial computations like `pred ? 'Right!' : 'Wrong'`.

# Organization
- Group related functions and objects together.
- Keep function interfaces simple (few parameters, simple return types).
- Avoid implicit defaults; always specify options explicitly: `getPosition(330)` not `getPosition()`.

# Comments & Documentation
- Explain reasoning behind decisions, not just functionality.
- Provide context for complex algorithms, unusual strategies, or constraints.
- Write comments as complete sentences with proper punctuation and grammar.
- Document assumptions and invariants.
- Provide `@param`, `@template` (if applicable), `@returns`, `@throws` (if applicable) tags.

# Testing
- Test error handling code extensively.
- Use negative testing (invalid inputs).
- Employ fault injection (simulate failures).
- Verify recovery mechanisms.
- Test boundary conditions (areas between valid and invalid data).
