## Context

Standard Toolkit is a monorepo with 29 packages across three categories: toolkits (3), packages (21), and tooling (8). Current documentation is fragmented:
- Generated API docs from accelint-api-docs skill are colocated in `packages/*/src/`
- Human-crafted guides exist in `packages/*/src/documentation/`
- No centralized discovery mechanism

Fumadocs v16.9.2 is already installed in `apps/docs` with basic providers configured. We need to establish a complete documentation website that organizes all packages into a navigable structure while maintaining design consistency with design-toolkit.

**Constraints:**
- Must not add new external dependencies (fumadocs already installed)
- Must preserve existing frontmatter in generated API docs
- Must support incremental documentation (packages without docs yet get stub pages)
- Must follow design-toolkit aesthetic

## Goals / Non-Goals

**Goals:**
- Centralized documentation site at `apps/docs` with three collapsible sections (Toolkits, Packages, Tooling)
- Unified content source at `apps/docs/content/` with section-based folder structure
- Search functionality across all documentation
- Refactored accelint-api-docs skill writes to `apps/docs/content/` instead of colocating in source packages
- Responsive sidebar navigation with fumadocs Page Tree
- Homepage with hero section and package discovery grid
- Design-toolkit styling integration

**Non-Goals:**
- Component playground for design-toolkit (future enhancement)
- API versioning (defer until packages reach major versions)
- Changelog integration (future enhancement)
- Dependency graph visualization (future enhancement)
- Documentation for turbo-filter and constellation-tracker (explicitly excluded)

## Decisions

### Decision 1: Folder-based content organization over flat structure

**Choice:** Use section folders (`toolkits/`, `packages/`, `tooling/`) with nested package directories

**Rationale:** 
- Fumadocs supports folder-based sections via `meta.json` files
- Mirrors the monorepo's logical grouping (toolkits vs packages vs tooling)
- Collapsible sidebar sections reduce visual clutter for 29 packages
- Easier to add packages to appropriate section

**Alternatives considered:**
- Flat structure with all packages at root → Would create 29 top-level entries, poor UX
- Single "Packages" section → Loses semantic distinction between toolkits and tooling

### Decision 2: Refactor accelint-api-docs skill output path

**Choice:** Modify skill to write to `apps/docs/content/[section]/[package-name]/api/` instead of `packages/*/src/`

**Rationale:**
- Separates documentation from source code (docs-as-artifact not docs-as-code)
- Centralizes all documentation in one location for easier discovery
- Allows docs to be built/deployed independently of package releases
- Simplifies `.fumadocsignore` (no need to filter out source directories)

**Alternatives considered:**
- Keep colocated docs, symlink to apps/docs → Fragile, hard to maintain, breaks fumadocs file watching
- Generate at build time → Requires build-time skill execution, complicates CI

**Migration strategy:**
- Update skill before generating new docs
- Existing colocated docs can remain temporarily (not indexed by fumadocs)
- Clean up old colocated docs after verifying new structure works

### Decision 3: Single unified source loader

**Choice:** One `source` instance in `src/utils/source.ts` that loads all content from `apps/docs/content/`

**Rationale:**
- Fumadocs loader handles multiple sections automatically
- Simpler than multiple source instances per section
- Single Page Tree for navigation
- Unified search index

**Alternatives considered:**
- Separate loaders per section → More complex, harder to maintain cross-references

### Decision 4: Package overview pages as entry points

**Choice:** Each package gets `index.mdx` with description, installation, and navigation to guides/api subdirectories

**Rationale:**
- Provides landing page even for packages without detailed docs yet
- Can auto-generate from package.json metadata
- Sets expectation for documentation structure
- Clear call-to-action for "detailed documentation coming soon" packages

**Alternatives considered:**
- Skip packages without docs → Creates gaps in navigation, poor discovery
- Redirect to API docs → Assumes API docs exist, less welcoming

### Decision 5: meta.json for navigation control

**Choice:** Use fumadocs `meta.json` files at section and package levels to control sidebar order

**Rationale:**
- Fumadocs convention for explicit ordering
- Allows customization (e.g., "Getting Started" before sections)
- Version-controlled navigation structure
- Clear contract for what appears in sidebar

**Structure:**
```
content/meta.json                    # Root: ["getting-started", "toolkits", "packages", "tooling"]
content/toolkits/meta.json          # Section: {title: "Toolkits", pages: [...]}
content/toolkits/logger/meta.json   # Package: {title: "Logger", pages: ["index", "guides", "api"]}
```

### Decision 6: Design-toolkit integration via CSS modules and globals.css

**Choice:** Create style modules for docs layout and override fumadocs-ui components via CSS custom properties in globals.css

**Rationale:**
- Preserves fumadocs functionality while applying custom design
- CSS modules prevent style leakage
- Design tokens in globals.css for consistency
- Avoids forking fumadocs components

**Alternatives considered:**
- Completely custom components → Reinventing fumadocs features, more maintenance
- Styled-components → Adds dependency, not monorepo pattern

## Risks / Trade-offs

**[Risk] Skill refactoring breaks existing workflows** → Mitigation: Test refactored skill on sample packages before full rollout, preserve frontmatter format, add regression tests

**[Risk] 29 packages create overwhelming navigation** → Mitigation: Collapsible sections keep sidebar compact, search helps discovery, section grouping provides mental model

**[Risk] Generated API docs become stale** → Mitigation: Document how to regenerate docs in CLAUDE.md, consider adding pre-commit hook or CI check (future)

**[Trade-off] Centralized docs require migration** → Benefit: Single source of truth outweighs one-time migration cost

**[Trade-off] Stub pages for undocumented packages** → Benefit: Complete discovery surface even if some packages lack detailed docs yet

**[Risk] Fumadocs version lock-in** → Mitigation: Already using v16.9.2, no breaking changes expected in minor versions, content structure is portable (markdown files)

**[Risk] Design-toolkit styling conflicts with fumadocs** → Mitigation: CSS modules namespace styles, test responsive behavior across breakpoints, use CSS custom properties for theming

## Migration Plan

### Phase 1: Skill Refactoring (blocking)
1. Update accelint-api-docs skill output path logic
2. Test on 2-3 sample packages (logger, math, constants)
3. Verify frontmatter preservation and file structure

### Phase 2: Foundation Setup
1. Update `source.config.ts` with unified source
2. Create `src/utils/source.ts` loader
3. Implement `app/docs/layout.tsx` and `app/docs/[[...slug]]/page.tsx`
4. Verify basic routing works

### Phase 3: Content Structure
1. Create section directories and root `meta.json`
2. Create section-level `meta.json` files
3. Migrate existing guides to new structure
4. Create Getting Started content

### Phase 4: Package Pages
1. Generate package overview pages with package.json metadata
2. Create package-level `meta.json` files
3. Run refactored skill to generate API docs

### Phase 5: Homepage & Styling
1. Implement homepage hero and package grid
2. Create style modules
3. Update globals.css with design tokens
4. Add search route

### Phase 6: Polish
1. Test all navigation flows
2. Verify responsive design
3. Run verification gate (build, lint, format)

**Rollback strategy:**
- Git branch isolation (changes on `feat/doc-skill-rfc`)
- Skill changes can be reverted without affecting existing docs
- Content migration is additive (doesn't remove source docs immediately)
- Next.js app changes don't affect other monorepo packages

## Open Questions

- **Q:** Should we auto-generate package overview pages from package.json or write manually?
  - **Lean:** Auto-generate with template, allows manual enhancement
  
- **Q:** How to handle packages with no exported APIs (like configs)?
  - **Lean:** Overview page with usage examples, link to source code

- **Q:** Should Getting Started be inside a folder or at root level?
  - **Lean:** Folder (`getting-started/`) for consistency, allows multiple pages (index, installation, contributing)
