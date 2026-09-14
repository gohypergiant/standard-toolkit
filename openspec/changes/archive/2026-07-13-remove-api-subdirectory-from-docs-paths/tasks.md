# Implementation Tasks: Remove `/api/` Subdirectory from Documentation Paths

## Slice 1: Update Skill Path Logic + Validate with Single Package

**Deliverable**: Modified skill generates correct paths (no `/api/`, `.mdx` extension, correct section mapping) for one test package.

- [x] 1.1 Edit `.agents/skills/accelint-api-docs/SKILL.md` - remove `design-foundation` from toolkits list
- [x] 1.2 Update SKILL.md to show only `design-toolkit` and `map-toolkit` → `toolkits/`
- [x] 1.3 Add `design-foundation` to packages list in SKILL.md
- [x] 1.4 Test: Grep SKILL.md confirms design-foundation only appears in packages section
- [x] 1.5 Edit skill code to remove `/api/` subdirectory insertion
- [x] 1.6 Change file extension from `.md` to `.mdx` in skill code
- [x] 1.7 Update path construction to: `{outputDir}/{section}/{package-name}/{relative-path}.mdx`
- [ ] 1.8 Test: Generate docs for `packages/bus` and verify output is `apps/docs/content/packages/bus/index.mdx`
- [x] 1.9 Add filters to skip `*.test.ts`, `*.test.tsx` files
- [x] 1.10 Add filters to skip `__tests__/`, `__mocks__/` directories
- [x] 1.11 Preserve ability to read test files for usage examples (input only)
- [ ] 1.12 Test: Verify test files in `packages/bus` are not documented but can be read for examples
- [ ] 1.13 Run skill against `packages/bus`
- [ ] 1.14 Verify path: `apps/docs/content/packages/bus/` (no `/api/`)
- [ ] 1.15 Verify extension: all files are `.mdx`
- [ ] 1.16 Verify frontmatter preserved
- [ ] 1.17 Test: `pnpm run build` in apps/docs succeeds, fumadocs recognizes new bus docs

## Slice 2: Migrate Tracking to JSON Index + Validate Against Existing Data

**Deliverable**: JSON index at `apps/docs/.index.json` with all current mappings migrated from markdown table.

- [x] 2.1 Read `ACCELINT_API_DOCS_MAPPING.md`
- [x] 2.2 Extract all rows (source path, doc path, entities, timestamps)
- [x] 2.3 Test: Confirm row count matches expected number of documented files
- [x] 2.4 Create `apps/docs/.index.json` with schema from design
- [x] 2.5 Convert markdown rows to JSON entries with fields: source, doc, entities, source_sha, doc_sha, updated
- [x] 2.6 Add version: "1.0" and generated timestamp to JSON
- [x] 2.7 Test: Validate JSON is parseable and contains all migrated entries
- [x] 2.8 Modify skill to read/write `apps/docs/.index.json` instead of markdown table
- [x] 2.9 Update index after each documentation generation
- [ ] 2.10 Test: Generate docs for one package and verify `.index.json` updates correctly
- [x] 2.11 Write validation script to compare index entries with actual files
- [x] 2.12 Check for orphaned docs (in index but not on disk)
- [x] 2.13 Check for missing docs (on disk but not in index)
- [x] 2.14 Test: Validation script reports zero discrepancies

## Slice 3: Full Regeneration + Section Migration + Cleanup

**Deliverable**: All packages regenerated with new paths, design-foundation moved to correct section, old structure cleaned up.

- [ ] 3.1 Run skill against all packages in `packages/`
- [ ] 3.2 Run skill against all packages in `tooling/`
- [ ] 3.3 Verify all output follows new pattern (no `/api/`, `.mdx` extension)
- [ ] 3.4 Test: Count of `.mdx` files matches expected based on source exports
- [x] 3.5 Move `apps/docs/content/toolkits/design-foundation/` to `apps/docs/content/packages/design-foundation/`
- [x] 3.6 Update any cross-references in other docs pointing to old design-foundation path
- [x] 3.7 Update `.index.json` with new paths for design-foundation
- [x] 3.8 Test: `pnpm run build` succeeds, no broken links to design-foundation
- [x] 3.9 Remove all `/api/` subdirectories from `apps/docs/content/`
- [x] 3.10 Remove `.md` files (replaced by `.mdx`)
- [x] 3.11 Remove old `ACCELINT_API_DOCS_MAPPING.md` from root
- [x] 3.12 Test: `find apps/docs/content -name api -type d` returns empty
- [x] 3.13 Run `pnpm --filter @accelint/docs run build`
- [x] 3.14 Check build output for errors or warnings
- [ ] 3.15 Manually test navigation in dev mode to spot-check links
- [x] 3.16 Test: Build exits 0, no 404s in console, navigation tree shows all packages

## Slice 4: Update Fumadocs Links + Final Verification

**Deliverable**: All internal links work correctly, verification gate passes.

- [x] 4.1 Grep all `.mdx` files for links to old `/api/` paths
- [x] 4.2 Update to new relative paths without `/api/`
- [x] 4.3 Remove `.mdx` extensions from links (fumadocs routing convention)
- [x] 4.4 Test: No grep matches for `/api/` in link hrefs
- [x] 4.5 Search build scripts, config files for hardcoded paths with `/api/`
- [x] 4.6 Update to new structure
- [x] 4.7 Test: `rg '/api/' apps/docs package.json` returns no build-related matches
- [x] 4.8 Run `pnpm run build` (all packages + docs)
- [x] 4.9 Run `pnpm run test`
- [x] 4.10 Run `pnpm run lint`
- [x] 4.11 Run `pnpm run format`
- [x] 4.12 Test: All four commands exit 0
- [ ] 4.13 Run `pnpm changeset`
- [ ] 4.14 Document breaking change (path structure changed)
- [ ] 4.15 Mark as minor bump for accelint-api-docs skill
- [ ] 4.16 Test: `.changeset/` contains new changeset file describing the change
