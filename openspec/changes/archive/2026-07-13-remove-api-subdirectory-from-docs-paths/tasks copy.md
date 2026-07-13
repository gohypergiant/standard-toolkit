# Implementation Tasks: Remove `/api/` Subdirectory from Documentation Paths

## Slice 1: Update Skill Path Logic + Validate with Single Package

**Deliverable**: Modified skill generates correct paths (no `/api/`, `.mdx` extension, correct section mapping) for one test package.

### 1.1 Update Section Mapping in SKILL.md
- Edit `.agents/skills/accelint-api-docs/SKILL.md`
- Remove `design-foundation` from toolkits list
- Update documentation to show only `design-toolkit` and `map-toolkit` → `toolkits/`
- Add `design-foundation` to packages list
- **Test**: Grep SKILL.md confirms design-foundation only appears in packages section

### 1.2 Update Path Generation Logic
- Edit skill code to remove `/api/` subdirectory insertion
- Change file extension from `.md` to `.mdx`
- Update path construction to: `{outputDir}/{section}/{package-name}/{relative-path}.mdx`
- **Test**: Generate docs for `packages/bus` and verify output is `apps/docs/content/packages/bus/index.mdx` (not `.../api/index.md`)

### 1.3 Add Test File Exclusion
- Add filters to skip `*.test.ts`, `*.test.tsx` files
- Add filters to skip `__tests__/`, `__mocks__/` directories
- Preserve ability to read test files for usage examples (input only)
- **Test**: Verify test files in `packages/bus` are not documented but can be read for examples

### 1.4 Validate End-to-End with Bus Package
- Run skill against `packages/bus` 
- Verify path: `apps/docs/content/packages/bus/` (no `/api/`)
- Verify extension: all files are `.mdx`
- Verify frontmatter preserved
- **Test**: `pnpm run build` in apps/docs succeeds, fumadocs recognizes new bus docs

## Slice 2: Migrate Tracking to JSON Index + Validate Against Existing Data

**Deliverable**: JSON index at `apps/docs/.index.json` with all current mappings migrated from markdown table.

### 2.1 Parse Existing Markdown Tracking File
- Read `ACCELINT_API_DOCS_MAPPING.md`
- Extract all rows (source path, doc path, entities, timestamps)
- **Test**: Confirm row count matches expected number of documented files

### 2.2 Create JSON Index Structure
- Create `apps/docs/.index.json` with schema from design
- Convert markdown rows to JSON entries with fields: source, doc, entities, source_sha, doc_sha, updated
- Add version: "1.0" and generated timestamp
- **Test**: Validate JSON is parseable and contains all migrated entries

### 2.3 Update Skill to Use JSON Index
- Modify skill to read/write `apps/docs/.index.json` instead of markdown table
- Update index after each documentation generation
- **Test**: Generate docs for one package and verify `.index.json` updates correctly

### 2.4 Validate Index Against File System
- Write validation script to compare index entries with actual files
- Check for orphaned docs (in index but not on disk)
- Check for missing docs (on disk but not in index)
- **Test**: Validation script reports zero discrepancies

## Slice 3: Full Regeneration + Section Migration + Cleanup

**Deliverable**: All packages regenerated with new paths, design-foundation moved to correct section, old structure cleaned up.

### 3.1 Regenerate All Package Documentation
- Run skill against all packages in `packages/`
- Run skill against all packages in `tooling/`
- Verify all output follows new pattern (no `/api/`, `.mdx` extension)
- **Test**: Count of `.mdx` files matches expected based on source exports

### 3.2 Move design-foundation Documentation
- Move `apps/docs/content/toolkits/design-foundation/` to `apps/docs/content/packages/design-foundation/`
- Update any cross-references in other docs pointing to old path
- Update `.index.json` with new paths for design-foundation
- **Test**: `pnpm run build` succeeds, no broken links to design-foundation

### 3.3 Clean Up Old /api/ Directories
- Remove all `/api/` subdirectories from `apps/docs/content/`
- Remove `.md` files (replaced by `.mdx`)
- Remove old `ACCELINT_API_DOCS_MAPPING.md` from root
- **Test**: `find apps/docs/content -name api -type d` returns empty

### 3.4 Verify Fumadocs Build and Navigation
- Run `pnpm --filter @accelint/docs run build`
- Check build output for errors or warnings
- Manually test navigation in dev mode to spot-check links
- **Test**: Build exits 0, no 404s in console, navigation tree shows all packages

## Slice 4: Update Fumadocs Links + Final Verification

**Deliverable**: All internal links work correctly, verification gate passes.

### 4.1 Audit and Fix Cross-Reference Links
- Grep all `.mdx` files for links to old `/api/` paths
- Update to new relative paths without `/api/`
- Remove `.mdx` extensions from links (fumadocs routing convention)
- **Test**: No grep matches for `/api/` in link hrefs

### 4.2 Update Hardcoded Path References
- Search build scripts, config files for hardcoded paths with `/api/`
- Update to new structure
- **Test**: `rg '/api/' apps/docs package.json` returns no build-related matches

### 4.3 Run Full Verification Gate
- `pnpm run build` (all packages + docs)
- `pnpm run test`
- `pnpm run lint`
- `pnpm run format`
- **Test**: All four commands exit 0

### 4.4 Create Changeset
- Run `pnpm changeset`
- Document breaking change (path structure changed)
- Mark as minor bump for accelint-api-docs skill
- **Test**: `.changeset/` contains new changeset file describing the change
