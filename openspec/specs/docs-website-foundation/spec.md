# Docs Website Foundation

## Purpose

Core infrastructure for the fumadocs-based documentation website including routing, content loading, and page rendering.

## Requirements

### Requirement: Documentation site SHALL use fumadocs framework

The documentation website MUST be built using fumadocs v16.9.2 with Next.js as the underlying framework.

#### Scenario: Fumadocs dependencies are available
- **WHEN** building the documentation site
- **THEN** fumadocs-mdx, fumadocs-ui, and fumadocs-core MUST be installed and available

#### Scenario: No new external dependencies are added
- **WHEN** implementing the documentation site
- **THEN** no additional external dependencies beyond those already in package.json MUST be added

### Requirement: Content SHALL be loaded via unified source loader

All documentation content MUST be loaded through a single source instance that reads from `apps/docs/content/`.

#### Scenario: Source configuration defines content directory
- **WHEN** fumadocs is configured in `source.config.ts`
- **THEN** it MUST define a docs source pointing to the `content` directory

#### Scenario: Source loader is accessible throughout the app
- **WHEN** pages need to access documentation content
- **THEN** they MUST import the source from `src/utils/source.ts`

### Requirement: Docs pages SHALL render via catch-all route

All documentation pages MUST be served through a Next.js catch-all dynamic route.

#### Scenario: Catch-all route handles all docs paths
- **WHEN** a user navigates to any `/docs/*` path
- **THEN** the route handler at `app/docs/[[...slug]]/page.tsx` MUST process the request

#### Scenario: 404 for non-existent pages
- **WHEN** a user navigates to a documentation path that doesn't exist
- **THEN** the system MUST return a 404 not found response

#### Scenario: Static params are generated at build time
- **WHEN** building the site for production
- **THEN** `generateStaticParams()` MUST generate paths for all documentation pages

### Requirement: Docs layout SHALL provide consistent structure

The documentation layout MUST wrap all docs pages with consistent navigation and styling.

#### Scenario: Layout wraps all docs pages
- **WHEN** rendering any page under `/docs`
- **THEN** `app/docs/layout.tsx` MUST provide the layout wrapper

#### Scenario: Layout includes fumadocs DocsLayout component
- **WHEN** rendering the docs layout
- **THEN** it MUST use fumadocs-ui's DocsLayout component for consistent structure

### Requirement: MDX content SHALL be rendered correctly

MDX files MUST be compiled and rendered with proper component support.

#### Scenario: MDX files are processed by fumadocs-mdx
- **WHEN** an MDX file is requested
- **THEN** it MUST be compiled by fumadocs-mdx and the default export MUST be a React component

#### Scenario: MDX includes table of contents
- **WHEN** rendering a page
- **THEN** the `toc` (table of contents) export MUST be available and passed to DocsPage component

### Requirement: Pages SHALL have metadata

Each documentation page MUST generate appropriate metadata for SEO.

#### Scenario: Page title from frontmatter
- **WHEN** rendering a page
- **THEN** the metadata MUST use the page's title from frontmatter or content

#### Scenario: Page description from frontmatter
- **WHEN** rendering a page with a description in frontmatter
- **THEN** the metadata MUST include the description

### Requirement: Edit on GitHub link SHALL be available

Each documentation page MUST provide a link to edit the source on GitHub.

#### Scenario: GitHub edit link configuration
- **WHEN** rendering a page with DocsPage component
- **THEN** it MUST include `editOnGithub` prop with owner: "gohypergiant", repo: "standard-toolkit", and the correct file path

#### Scenario: Edit link points to correct file
- **WHEN** a user clicks the edit link
- **THEN** it MUST navigate to the corresponding markdown file in the GitHub repository at `apps/docs/content/{page.file.path}`
