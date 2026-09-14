# API Doc Generation

## Purpose

Automated generation of TypeScript/React API reference documentation from source code, outputting to a centralized documentation site structure.

## Requirements

### Requirement: accelint-api-docs skill SHALL write to apps/docs/content

The accelint-api-docs skill MUST be refactored to output generated API documentation to `apps/docs/content/` instead of colocating in source packages.

#### Scenario: Output path is configurable
- **WHEN** invoking the accelint-api-docs skill
- **THEN** it MUST accept an optional `outputDir` parameter with default value `apps/docs/content`

#### Scenario: Generated docs go to correct section path without /api/ subdirectory
- **WHEN** documenting a package
- **THEN** the output MUST be written to `{outputDir}/{section}/{package-name}/` WITHOUT an `/api/` subdirectory

#### Scenario: Generated files use .mdx extension
- **WHEN** generating documentation files
- **THEN** the output file extension MUST be `.mdx` instead of `.md`

### Requirement: Skill SHALL detect package section automatically

The skill MUST automatically determine whether a package belongs to toolkits, packages, or tooling sections.

#### Scenario: Only design-toolkit and map-toolkit map to toolkits section
- **WHEN** documenting design-toolkit or map-toolkit
- **THEN** the output path MUST use `toolkits/` as the section

#### Scenario: Standard packages including design-foundation map to packages section
- **WHEN** documenting design-foundation, bus, constants, core, dataset, formatters, geo, hotkey-manager, icons, logger, math, ntds, predicates, temporal, web-worker, or websocket
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

The directory structure within the package directory MUST mirror the source package structure.

#### Scenario: Nested source structure is preserved without /api/ subdirectory
- **WHEN** documenting `packages/logger/src/plugins/callsite.ts`
- **THEN** the output MUST be `apps/docs/content/packages/logger/plugins/callsite.mdx`

#### Scenario: Index files are named correctly with .mdx extension
- **WHEN** documenting an index file like `packages/math/src/clamp/index.ts`
- **THEN** the output MUST be `apps/docs/content/packages/math/clamp/index.mdx`

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

#### Scenario: Missing directories are created automatically without /api/
- **WHEN** generating docs for a package that doesn't have a docs directory yet
- **THEN** the skill MUST create `{outputDir}/{section}/{package-name}/` before writing files (WITHOUT creating an `/api/` subdirectory)

#### Scenario: Nested directories are created
- **WHEN** generating docs that require nested directories (e.g., `plugins/`)
- **THEN** the skill MUST create all necessary parent directories

### Requirement: Skill SHALL exclude test files from documentation

The skill MUST exclude test files and test directories from generated documentation.

#### Scenario: Test files are skipped
- **WHEN** scanning source files for documentation
- **THEN** files matching `*.test.ts` or `*.test.tsx` MUST be excluded from documentation output

#### Scenario: Test directories are skipped
- **WHEN** scanning source directories for documentation
- **THEN** directories named `__tests__/` or `__mocks__/` MUST be excluded from scanning

#### Scenario: Test files can be read for examples
- **WHEN** generating documentation for a production export
- **THEN** test files MAY be read to extract usage examples but MUST NOT generate their own documentation pages

### Requirement: Tracking file SHALL use JSON format at apps/docs/.index.json

The skill MUST maintain a JSON-formatted index file following the Karpathy Wiki pattern for tracking generated documentation.

#### Scenario: Index file is structured JSON
- **WHEN** updating the tracking index
- **THEN** it MUST be written to `apps/docs/.index.json` with structured data including version, generated timestamp, and entries array

#### Scenario: Each entry tracks source and doc paths
- **WHEN** documenting a source file
- **THEN** the index entry MUST include: source path, doc path, entity names, source SHA, doc SHA, and updated timestamp

#### Scenario: Index enables staleness detection
- **WHEN** querying the index
- **THEN** it MUST be possible to determine if documentation is out of sync with source by comparing source_sha values

#### Scenario: Index supports programmatic queries
- **WHEN** external tools need to query documentation mapping
- **THEN** they MUST be able to parse the JSON index without regex or markdown parsing

### Requirement: Generated links SHALL follow fumadocs conventions

The skill MUST generate internal documentation links that work correctly within the fumadocs/Next.js App Router environment.

#### Scenario: Links use relative paths from content root
- **WHEN** generating a cross-reference link to another API doc
- **THEN** the link MUST use a relative path compatible with fumadocs routing (e.g., `../../packages/bus/index`)

#### Scenario: Links exclude file extensions
- **WHEN** generating a link to another documentation page
- **THEN** the link path MUST NOT include the `.mdx` extension as fumadocs handles routing automatically

#### Scenario: Links work in development and production
- **WHEN** fumadocs builds the documentation site
- **THEN** all generated internal links MUST resolve correctly without 404 errors
