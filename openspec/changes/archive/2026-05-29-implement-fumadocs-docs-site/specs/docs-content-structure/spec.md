## ADDED Requirements

### Requirement: Content SHALL be organized into section-based folders

The documentation content SHALL be organized into three top-level sections: `toolkits/`, `packages/`, and `tooling/` within `apps/docs/content/`.

#### Scenario: Content directory structure exists
- **WHEN** the documentation site is set up
- **THEN** the following directories MUST exist: `apps/docs/content/toolkits/`, `apps/docs/content/packages/`, `apps/docs/content/tooling/`, and `apps/docs/content/getting-started/`

#### Scenario: Package content is organized by section
- **WHEN** a package belongs to the toolkits category
- **THEN** its documentation MUST be located at `apps/docs/content/toolkits/{package-name}/`

#### Scenario: Excluded packages are not included
- **WHEN** generating the content structure
- **THEN** turbo-filter and constellation-tracker MUST NOT have directories in the content structure

### Requirement: Navigation SHALL be controlled by meta.json files

Each section and package MUST have a `meta.json` file that defines the navigation order and titles.

#### Scenario: Root meta.json defines section order
- **WHEN** fumadocs loads the page tree
- **THEN** `apps/docs/content/meta.json` MUST specify the order as: `["getting-started", "toolkits", "packages", "tooling"]`

#### Scenario: Section meta.json defines title and package list
- **WHEN** fumadocs renders a section in the sidebar
- **THEN** `apps/docs/content/{section}/meta.json` MUST contain a `title` field and a `pages` array listing package directory names in order

#### Scenario: Package meta.json defines internal navigation
- **WHEN** a package has multiple documentation types (guides, API)
- **THEN** `apps/docs/content/{section}/{package-name}/meta.json` MUST list the page order (e.g., `["index", "guides", "api"]`)

### Requirement: Each package SHALL have an overview page

Every package MUST have an `index.mdx` file that serves as the landing page.

#### Scenario: Package overview page exists
- **WHEN** a package is included in the documentation
- **THEN** the file `apps/docs/content/{section}/{package-name}/index.mdx` MUST exist

#### Scenario: Overview page contains minimum required content
- **WHEN** rendering a package overview page
- **THEN** the page MUST include: package name, description, installation instructions, and links to guides/api subdirectories (if they exist)

#### Scenario: Undocumented packages have stub pages
- **WHEN** a package does not yet have detailed guides or API documentation
- **THEN** the overview page MUST display "Detailed documentation coming soon" with a link to the source code

### Requirement: API documentation SHALL be separated from guides

Generated API documentation and human-crafted guides MUST be in separate subdirectories within each package.

#### Scenario: API docs are in api/ subdirectory
- **WHEN** API documentation is generated for a package
- **THEN** the files MUST be written to `apps/docs/content/{section}/{package-name}/api/`

#### Scenario: Guides are in guides/ subdirectory
- **WHEN** human-crafted guides exist for a package
- **THEN** the files MUST be located at `apps/docs/content/{section}/{package-name}/guides/`

#### Scenario: Subdirectories are optional
- **WHEN** a package has neither API docs nor guides
- **THEN** only the `index.mdx` file needs to exist (no api/ or guides/ subdirectories required)

### Requirement: Getting Started SHALL be a top-level section

The Getting Started content MUST be organized in a dedicated folder at the root level.

#### Scenario: Getting Started folder exists
- **WHEN** the documentation site is initialized
- **THEN** `apps/docs/content/getting-started/` MUST exist with at least an `index.mdx` file

#### Scenario: Getting Started appears first in navigation
- **WHEN** rendering the sidebar navigation
- **THEN** Getting Started MUST appear before the Toolkits, Packages, and Tooling sections

### Requirement: Package count SHALL match monorepo structure

The documentation MUST cover exactly 27 packages (excluding turbo-filter and constellation-tracker).

#### Scenario: Toolkits section has 3 packages
- **WHEN** rendering the Toolkits section
- **THEN** it MUST contain exactly: design-foundation, design-toolkit, and map-toolkit

#### Scenario: Packages section has 15 packages
- **WHEN** rendering the Packages section
- **THEN** it MUST contain: bus, constants, core, dataset, formatters, geo, hotkey-manager, icons, logger, math, ntds, predicates, temporal, web-worker, and websocket

#### Scenario: Tooling section has 7 packages
- **WHEN** rendering the Tooling section
- **THEN** it MUST contain: postcss-tailwind-css-modules, biome-config, eslint-config, prettier-config, smeegl, typescript-config, and vitest-config

### Requirement: Frontmatter SHALL be preserved in migrated content

When migrating existing documentation, all frontmatter metadata MUST be preserved.

#### Scenario: Generated API docs preserve frontmatter
- **WHEN** API documentation is generated and written to the new location
- **THEN** the frontmatter fields (title, description, source, source_sha, doc_sha, deprecated, updated) MUST be identical to the original

#### Scenario: Migrated guides preserve frontmatter
- **WHEN** human-crafted guides are moved from `packages/*/src/documentation/` to `apps/docs/content/{section}/{package-name}/guides/`
- **THEN** all original frontmatter MUST be retained
