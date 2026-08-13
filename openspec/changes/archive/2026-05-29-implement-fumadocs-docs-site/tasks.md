## 1. Refactor accelint-api-docs Skill

- [x] 1.1 Add outputDir parameter to skill with default value `apps/docs/content`
- [x] 1.2 Implement section detection logic (toolkits/packages/tooling mapping)
- [x] 1.3 Update output path generation to use `{outputDir}/{section}/{package-name}/api/`
- [x] 1.4 Add logic to create directories if they don't exist
- [x] 1.5 Ensure frontmatter preservation (title, description, source, source_sha, doc_sha, deprecated, updated)
- [x] 1.6 Test skill on logger package and verify output location
- [x] 1.7 Test skill on math package and verify nested structure
- [x] 1.8 Test skill on design-toolkit and verify toolkits section mapping

## 2. Foundation Setup

- [x] 2.1 Update `apps/docs/source.config.ts` to define docs source pointing to content directory
- [x] 2.2 Create `apps/docs/src/utils/source.ts` with unified source loader
- [x] 2.3 Create `apps/docs/app/docs/layout.tsx` with DocsLayout component
- [x] 2.4 Implement `apps/docs/app/docs/[[...slug]]/page.tsx` with catch-all route
- [x] 2.5 Add generateStaticParams function for build-time static generation
- [x] 2.6 Add generateMetadata function for SEO
- [x] 2.7 Configure editOnGithub prop with correct repository details
- [x] 2.8 Verify basic routing works with test content

## 3. Content Directory Structure

- [x] 3.1 Create `apps/docs/content/getting-started/` directory
- [x] 3.2 Create `apps/docs/content/toolkits/` with subdirectories for design-foundation, design-toolkit, map-toolkit
- [x] 3.3 Create `apps/docs/content/packages/` with subdirectories for 15 packages
- [x] 3.4 Create `apps/docs/content/tooling/` with subdirectories for 7 tooling packages
- [x] 3.5 Create root `apps/docs/content/meta.json` with section order
- [x] 3.6 Create `apps/docs/content/toolkits/meta.json` with section title and package list
- [x] 3.7 Create `apps/docs/content/packages/meta.json` with section title and package list
- [x] 3.8 Create `apps/docs/content/tooling/meta.json` with section title and package list

## 4. Getting Started Content

- [x] 4.1 Create `apps/docs/content/getting-started/index.mdx` with introduction
- [x] 4.2 Add overview of available packages to Getting Started
- [x] 4.3 Add installation instructions to Getting Started
- [x] 4.4 Add contributing guidelines to Getting Started
- [x] 4.5 Create `apps/docs/content/getting-started/meta.json` with page list

## 5. Migrate Existing Documentation

- [x] 5.1 Copy `packages/design-foundation/src/documentation/tailwind.md` to `apps/docs/content/toolkits/design-foundation/guides/tailwind.mdx`
- [x] 5.2 Copy `packages/design-toolkit/src/documentation/react.md` to `apps/docs/content/toolkits/design-toolkit/guides/react.mdx`
- [x] 5.3 Verify frontmatter is preserved in migrated files
- [x] 5.4 Update any internal links to work with new structure

## 6. Package Overview Pages

- [x] 6.1 Create overview page template function/script
- [x] 6.2 Generate `index.mdx` for each toolkit (design-foundation, design-toolkit, map-toolkit)
- [x] 6.3 Generate `index.mdx` for each package (15 packages in packages/ section)
- [x] 6.4 Generate `index.mdx` for each tooling package (7 packages)
- [x] 6.5 Create package-level `meta.json` for packages with guides/api subdirectories
- [x] 6.6 Verify overview pages include: name, description, installation, links to guides/api

## 7. Generate API Documentation

- [x] 7.1 Run refactored accelint-api-docs on design-toolkit
- [x] 7.2 Run refactored accelint-api-docs on logger package
- [x] 7.3 Run refactored accelint-api-docs on math package
- [x] 7.4 Run refactored accelint-api-docs on constants package
- [x] 7.5 Verify API docs appear in correct `apps/docs/content/{section}/{package}/api/` locations
- [x] 7.6 Verify frontmatter is correct in generated files
- [x] 7.7 Generate API docs for remaining packages as needed

## 8. Homepage Implementation

- [x] 8.1 Create `apps/docs/src/components/homepage/hero.tsx` component
- [x] 8.2 Create `apps/docs/src/components/homepage/feature-grid.tsx` component
- [x] 8.3 Update `apps/docs/app/page.tsx` to use hero and feature-grid components
- [x] 8.4 Implement package grid showcasing all 27 packages
- [x] 8.5 Add visual grouping by section (Toolkits, Packages, Tooling)
- [x] 8.6 Make package cards clickable to navigate to package docs
- [x] 8.7 Add quick start section with installation command
- [x] 8.8 Add search/filter functionality for packages on homepage

## 9. Styling and Design

- [x] 9.1 Create `apps/docs/app/styles/docs.module.css` for docs layout styles
- [x] 9.2 Create `apps/docs/app/styles/homepage.module.css` for homepage styles
- [x] 9.3 Create `apps/docs/app/styles/code-block.module.css` for enhanced code blocks
- [x] 9.4 Update `apps/docs/app/globals.css` with design-toolkit tokens
- [x] 9.5 Configure CSS custom properties for fumadocs theming
- [x] 9.6 Test light and dark theme appearance
- [x] 9.7 Verify responsive design on mobile, tablet, and desktop

## 10. Search Implementation

- [x] 10.1 Create `apps/docs/app/api/search/route.ts` search API route
- [x] 10.2 Configure fumadocs search indexing for all content sections
- [x] 10.3 Verify search finds content from all sections
- [x] 10.4 Test search result navigation

## 11. Navigation Features

- [x] 11.1 Verify collapsible sections work in sidebar (Toolkits, Packages, Tooling)
- [x] 11.2 Verify active page highlighting in sidebar
- [x] 11.3 Verify parent section auto-expands for active page
- [x] 11.4 Test responsive sidebar (persistent on desktop, hamburger on mobile)
- [x] 11.5 Add GitHub repository link to navigation bar
- [x] 11.6 Verify theme toggle works and persists

## 12. Final Testing and Polish

- [x] 12.1 Test navigation flow through all sections
- [x] 12.2 Verify all internal links work
- [x] 12.3 Test Edit on GitHub links for sample pages
- [x] 12.4 Verify all 27 packages appear in navigation
- [x] 12.5 Test search across all documentation
- [x] 12.6 Verify responsive behavior on different screen sizes
- [x] 12.7 Run `pnpm build` and fix any build errors
- [x] 12.8 Run `pnpm lint` and fix any lint errors
- [x] 12.9 Run `pnpm format` to ensure consistent formatting
- [x] 12.10 Test the site in development mode (`pnpm dev`)
- [x] 12.11 Create `.fumadocsignore` to exclude unwanted content

## 13. Documentation and Cleanup

- [x] 13.1 Document how to regenerate API docs in CLAUDE.md or project documentation
- [x] 13.2 Add notes about the skill refactoring to AGENTS.md if applicable
- [x] 13.3 Consider cleaning up old colocated docs after verifying new structure works
- [x] 13.4 Update any project README or documentation that references docs location
