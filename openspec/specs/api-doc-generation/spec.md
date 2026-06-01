# API Doc Generation

## Purpose

Automated generation of TypeScript/React API reference documentation from source code, outputting to a centralized documentation site structure.

## Requirements

### Requirement: accelint-api-docs skill SHALL write to apps/docs/content

The accelint-api-docs skill MUST be refactored to output generated API documentation to `apps/docs/content/` instead of colocating in source packages.

#### Scenario: Output path is configurable
- **WHEN** invoking the accelint-api-docs skill
- **THEN** it MUST accept an optional `outputDir` parameter with default value `apps/docs/content`

#### Scenario: Generated docs go to correct section path
- **WHEN** documenting a package
- **THEN** the output MUST be written to `{outputDir}/{section}/{package-name}/api/`

### Requirement: Skill SHALL detect package section automatically

The skill MUST automatically determine whether a package belongs to toolkits, packages, or tooling sections.

#### Scenario: Toolkit packages map to toolkits section
- **WHEN** documenting design-foundation, design-toolkit, or map-toolkit
- **THEN** the output path MUST use `toolkits/` as the section

#### Scenario: Standard packages map to packages section
- **WHEN** documenting bus, constants, core, dataset, formatters, geo, hotkey-manager, icons, logger, math, ntds, predicates, temporal, web-worker, or websocket
- **THEN** the output path MUST use `packages/` as the section

#### Scenario: Tooling packages map to tooling section
- **WHEN** documenting postcss-tailwind-css-modules, biome-config, eslint-config, prettier-config, smeegl, typescript-config, or vitest-config
- **THEN** the output path MUST use `tooling/` as the section

#### Scenario: Section detection works with scoped names
- **WHEN** the skill receives a package name like `@accelint/logger`
- **THEN** it MUST correctly map to `packages/logger`

### Requirement: Generated markdown SHALL preserve frontmatter

The skill MUST preserve all existing frontmatter fields when generating API documentation.

#### Scenario: Standard frontmatter fields are included
- **WHEN** generating an API doc markdown file
- **THEN** it MUST include frontmatter fields: title, description, source, source_sha, doc_sha, deprecated (if applicable), and updated

#### Scenario: Frontmatter format is consistent
- **WHEN** generating frontmatter
- **THEN** it MUST use YAML format with `---` delimiters

### Requirement: Generated file structure SHALL match source structure

The directory structure within the `api/` subdirectory MUST mirror the source package structure.

#### Scenario: Nested source structure is preserved
- **WHEN** documenting `packages/logger/src/plugins/callsite.ts`
- **THEN** the output MUST be `apps/docs/content/packages/logger/api/plugins/callsite.md`

#### Scenario: Index files are named correctly
- **WHEN** documenting an index file like `packages/math/src/clamp/index.ts`
- **THEN** the output MUST be `apps/docs/content/packages/math/api/clamp/index.md`

### Requirement: Skill SHALL maintain markdown generation quality

The refactored skill MUST produce the same quality of markdown content as the current version.

#### Scenario: Type signatures are documented
- **WHEN** generating docs for a function or class
- **THEN** the markdown MUST include complete type signatures

#### Scenario: JSDoc comments are extracted
- **WHEN** source code includes JSDoc comments with @param, @returns, @example tags
- **THEN** the generated markdown MUST include this information in a readable format

#### Scenario: Code examples are formatted
- **WHEN** generating markdown with code examples
- **THEN** they MUST use proper markdown code fences with language identifiers

### Requirement: Skill SHALL handle edge cases

The skill MUST gracefully handle special cases in package names and paths.

#### Scenario: Hyphenated package names work correctly
- **WHEN** documenting postcss-tailwind-css-modules
- **THEN** the output path MUST correctly handle the hyphens: `tooling/postcss-tailwind-css-modules/api/`

#### Scenario: Packages without src directory
- **WHEN** documenting a package that doesn't follow the `src/` convention
- **THEN** the skill MUST handle the alternative structure without errors

#### Scenario: Non-existent packages are skipped
- **WHEN** the skill encounters a reference to a package that doesn't exist
- **THEN** it MUST skip it gracefully without crashing

### Requirement: Output directory SHALL be created if missing

The skill MUST create the necessary directory structure if it doesn't exist.

#### Scenario: Missing directories are created automatically
- **WHEN** generating docs for a package that doesn't have a docs directory yet
- **THEN** the skill MUST create `{outputDir}/{section}/{package-name}/api/` before writing files

#### Scenario: Nested api directories are created
- **WHEN** generating docs that require nested directories (e.g., `api/plugins/`)
- **THEN** the skill MUST create all necessary parent directories
