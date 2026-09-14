## Why

Standard Toolkit is a monorepo with 29 packages (21 in packages/, 8 in tooling/) but lacks centralized, navigable documentation. Developers need a single entry point to discover packages, understand APIs, and learn usage patterns. A fumadocs-based documentation site will provide searchable, organized documentation with auto-generated API references and human-crafted guides.

## What Changes

- **Refactor accelint-api-docs skill**: Modify output path to write generated API docs to `apps/docs/content/[section]/[package-name]/api/` instead of colocating in source packages
- **Create content directory structure**: Organize documentation into three sections (Toolkits, Packages, Tooling) with folder-based navigation
- **Migrate existing guides**: Move human-crafted documentation from `packages/*/src/documentation/` to `apps/docs/content/` structure
- **Build documentation website**: Implement fumadocs-based site with responsive sidebar, search, and collapsible sections
- **Generate API documentation**: Use refactored accelint-api-docs skill to populate API references for all packages
- **Create package overview pages**: Write landing pages for all 29 packages with descriptions, installation, and links
- **Design homepage**: Hero section, package grid showcase, and quick start guide
- **Style with design-toolkit**: Apply existing design tokens and components for visual consistency

## Capabilities

### New Capabilities

- `docs-content-structure`: Content organization with section-based folders (toolkits/packages/tooling) and meta.json configuration
- `docs-website-foundation`: Fumadocs-based Next.js site with layout, routing, and page rendering
- `docs-navigation`: Collapsible sidebar sections with search and theme toggle
- `docs-homepage`: Landing page with hero, package grid, and discovery features
- `api-doc-generation`: Refactored accelint-api-docs skill with configurable output directory

### Modified Capabilities

<!-- No existing capabilities are being modified -->

## Impact

**New Files:**
- `apps/docs/content/` directory structure (getting-started, toolkits, packages, tooling)
- `apps/docs/app/docs/layout.tsx` and `apps/docs/app/docs/[[...slug]]/page.tsx`
- `apps/docs/src/utils/source.ts`
- `apps/docs/app/api/search/route.ts`
- `apps/docs/src/components/homepage/*` components
- `apps/docs/app/styles/*.module.css` style modules

**Modified Files:**
- `.skills/accelint-api-docs.mdc` (output path refactoring)
- `apps/docs/source.config.ts` (unified content source)
- `apps/docs/app/page.tsx` (homepage implementation)
- `apps/docs/app/globals.css` (design tokens)

**Affected Systems:**
- Documentation generation workflow (accelint-api-docs)
- Build process (apps/docs Next.js app)
- Package metadata (all 29 packages need overview pages)

**Dependencies:**
- Existing: fumadocs-mdx, fumadocs-ui, fumadocs-core (already in package.json)
- No new external dependencies required
