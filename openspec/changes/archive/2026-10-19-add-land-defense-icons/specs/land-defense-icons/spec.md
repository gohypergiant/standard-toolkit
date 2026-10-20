## Purpose

Defines the 18 land and defense platform icons that `@accelint/icons` publishes (launchers, air-defense systems, artillery, tactical vehicles, a mobile radar, a comms unit and missile profiles), and how they share the existing icon contract and coexist with the existing `radar` icon.

## ADDED Requirements

### Requirement: Package publishes the 18 land and defense icons

`@accelint/icons` SHALL publish exactly these 18 new icons, each as a default-export subpath module and as a named export from the package root:

| Source name | Root named export | Subpath |
| --- | --- | --- |
| `shorad` | `Shorad` | `@accelint/icons/shorad` |
| `tbm-launcher` | `TbmLauncher` | `@accelint/icons/tbm-launcher` |
| `sam-launcher` | `SamLauncher` | `@accelint/icons/sam-launcher` |
| `artillery` | `Artillery` | `@accelint/icons/artillery` |
| `convoy` | `Convoy` | `@accelint/icons/convoy` |
| `thaad` | `Thaad` | `@accelint/icons/thaad` |
| `patriot` | `Patriot` | `@accelint/icons/patriot` |
| `m198` | `M198` | `@accelint/icons/m198` |
| `m777` | `M777` | `@accelint/icons/m777` |
| `mobile-radar` | `MobileRadar` | `@accelint/icons/mobile-radar` |
| `comms` | `Comms` | `@accelint/icons/comms` |
| `mrap` | `Mrap` | `@accelint/icons/mrap` |
| `humvee` | `Humvee` | `@accelint/icons/humvee` |
| `jltv` | `Jltv` | `@accelint/icons/jltv` |
| `aegis-ashore` | `AegisAshore` | `@accelint/icons/aegis-ashore` |
| `sm2` | `Sm2` | `@accelint/icons/sm2` |
| `sm3` | `Sm3` | `@accelint/icons/sm3` |
| `sm6` | `Sm6` | `@accelint/icons/sm6` |

After the change the package SHALL contain 259 icons in total (241 existing + 18 new), with 259 icon subpath keys in `package.json` `exports` in addition to `.` and `./package.json`.

#### Scenario: Default subpath import resolves to the new component
- **GIVEN** a consumer with the released `@accelint/icons` installed
- **WHEN** the consumer writes `import Thaad from '@accelint/icons/thaad'`
- **THEN** `Thaad` MUST be a React component that renders an `<svg>` element
- **AND** `import.meta.resolve('@accelint/icons/thaad')` MUST resolve to the package's `dist/thaad.js`

#### Scenario: Named root import resolves to the same component
- **GIVEN** a consumer with the released `@accelint/icons` installed
- **WHEN** the consumer writes `import { Sm6, TbmLauncher, AegisAshore } from '@accelint/icons'`
- **THEN** all three names MUST be defined React components
- **AND** `Sm6` MUST render the same markup as the default export of `@accelint/icons/sm6`

#### Scenario: Subpath module does not pull in other icons
- **GIVEN** the built package
- **WHEN** a bundler loads `@accelint/icons/mobile-radar`
- **THEN** the module MUST import only `react/jsx-runtime`
- **AND** it MUST NOT import any other icon module

#### Scenario: Every new icon is complete across all package layers
- **GIVEN** the built package
- **WHEN** each of the 18 source names (for example `jltv`) is checked
- **THEN** there MUST be a source `src/svg/jltv.svg`, a generated module `src/icons/jltv.tsx`, a root export `Jltv`, an `exports["./jltv"]` entry, `dist/jltv.js` and `dist/jltv.d.ts`
- **AND** counting each layer MUST give 259 sources, 259 generated modules, 259 root icon exports, 259 icon subpath keys, 259 `.js` files and 259 `.d.ts` files

#### Scenario: Missing type declaration is treated as a failure
- **GIVEN** a build in which `dist/sm2.js` exists but `dist/sm2.d.ts` does not
- **WHEN** the completeness count is run
- **THEN** the `.d.ts` count MUST be 258, not 259, and the change MUST be treated as incomplete
- **AND** a passing `publint` result MUST NOT be accepted as proof that every `.d.ts` exists, because `publint` does not report a missing `.d.ts`

### Requirement: Mobile radar coexists with the existing radar icon

The review artifact's design with id `radar` (label "Mobile radar") SHALL be published only as `mobile-radar` (`MobileRadar`, `@accelint/icons/mobile-radar`). The existing `radar`, `radar-site` and `radar-anomaly` icons SHALL keep their current source, generated output and built output.

#### Scenario: radar and mobile-radar resolve to distinct modules
- **GIVEN** the built package
- **WHEN** a consumer resolves `@accelint/icons/radar` and `@accelint/icons/mobile-radar`
- **THEN** they MUST resolve to `dist/radar.js` and `dist/mobile-radar.js` respectively
- **AND** dynamically importing each MUST return two different components (the existing circular radar glyph and the new mobile-radar vehicle)

#### Scenario: Existing radar output is unchanged
- **GIVEN** the committed `src/svg/radar.svg`, `src/icons/radar.tsx` and the `dist/radar.js` built before this change
- **WHEN** the package is regenerated and rebuilt with the 18 new sources
- **THEN** `src/svg/radar.svg` and `src/icons/radar.tsx` MUST be byte-identical to their previous content
- **AND** `dist/radar.js` MUST be byte-identical to the previous build
- **AND** the same MUST hold for `radar-site` and `radar-anomaly`

#### Scenario: Artifact id radar is never written over the existing source
- **GIVEN** the artifact file `toolkit-24/radar.svg`
- **WHEN** the 18 sources are added to the package
- **THEN** its content MUST be stored as `src/svg/mobile-radar.svg`
- **AND** no file named `radar.svg` MUST be created, replaced or edited

### Requirement: Icon names keep the artifact ids

The 17 non-radar icons SHALL use their artifact ids unchanged as kebab-case file and subpath names. Digits SHALL NOT be hyphenated, and the generated component names SHALL follow the existing PascalCase conversion of the file name.

#### Scenario: Digit-bearing names are not hyphenated
- **GIVEN** the artifact ids `sm2`, `sm3`, `sm6`, `m198` and `m777`
- **WHEN** a consumer imports `@accelint/icons/sm2` and `@accelint/icons/m198`
- **THEN** both imports MUST resolve
- **AND** `@accelint/icons/sm-2` and `@accelint/icons/m-198` MUST NOT exist as subpaths
- **AND** the root named exports MUST be `Sm2` and `M198`

#### Scenario: Multi-word names convert to PascalCase
- **GIVEN** the source names `tbm-launcher`, `sam-launcher` and `aegis-ashore`
- **WHEN** the components are generated
- **THEN** the root named exports MUST be `TbmLauncher`, `SamLauncher` and `AegisAshore`

#### Scenario: New names do not collide with existing exports
- **GIVEN** the 241 existing root named exports, including `Radar`, `RadarSite` and `RadarAnomaly`
- **WHEN** the 18 new root named exports are added
- **THEN** no new name MUST equal an existing name
- **AND** the root module MUST export 259 distinct icon names

### Requirement: New icons follow the existing icon rendering contract

Each of the 18 components SHALL render a single `<svg>` with `viewBox="0 0 24 24"`, root `fill="none"`, no `width` or `height` attribute, and path fill `currentColor` with no stroke. Each component SHALL accept optional `title` and `titleId` props and SHALL forward other SVG props, the same as existing icons. The generated markup SHALL NOT contain `aria-hidden`, `role` or interactive elements.

#### Scenario: Icon inherits colour from CSS
- **GIVEN** `<span style={{ color: '#00A3E0' }}><Patriot /></span>`
- **WHEN** the component renders
- **THEN** the drawn path MUST use `fill="currentColor"` and appear in `#00A3E0`
- **AND** the rendered `<svg>` MUST have no `stroke` on any path

#### Scenario: Icon scales with its container
- **GIVEN** the design-toolkit `Icon` wrapper with sizes `xsmall` (12px), `small` (16px), `medium` (20px) and `large` (24px)
- **WHEN** `<Humvee />` is rendered at each size
- **THEN** the `<svg>` MUST have `viewBox="0 0 24 24"` and no fixed `width`/`height`, so it scales to 12, 16, 20 and 24px

#### Scenario: Titled icon is exposed to assistive technology
- **GIVEN** `<Sm6 title="SM-6 missile" titleId="sm6-title" />`
- **WHEN** the component renders
- **THEN** the `<svg>` MUST contain `<title id="sm6-title">SM-6 missile</title>`
- **AND** the `<svg>` MUST have `aria-labelledby="sm6-title"`
- **AND** the `<svg>` MUST NOT have `aria-hidden`

#### Scenario: Untitled icon renders no title element
- **GIVEN** `<Convoy />` with no `title` prop
- **WHEN** the component renders
- **THEN** the `<svg>` MUST NOT contain a `<title>` element
- **AND** marking it decorative (for example with `aria-hidden`) MUST remain the consumer's choice, the same as existing icons

#### Scenario: Source carrying aria-hidden is rejected
- **GIVEN** the artifact's table-row inline `<svg>` for `shorad`, which has `aria-hidden="true"`
- **WHEN** a source file for `shorad` is chosen
- **THEN** that inline markup MUST NOT be used as the source
- **AND** the source MUST be the zip file `toolkit-24/shorad.svg`, which has no `aria-hidden`

### Requirement: Geometry matches the review artifact

Each new icon's path data SHALL match the artifact's 24px `toolkit-24/<id>.svg` path data, with the same shapes and path commands. The only allowed numeric difference SHALL be the pipeline's existing rounding to 3 decimal places, with no coordinate changed by more than 0.001 units. Comparisons SHALL be made on semantically matched absolute path coordinates, because the pipeline may re-encode path commands (for example absolute to relative) without changing the shape.

#### Scenario: Coordinates with more than 3 decimals are rounded
- **GIVEN** the `tbm-launcher` artifact path contains the coordinate `19.88667`, the `sam-launcher` path contains `13.65556`, and the `thaad` path contains `17.36389`
- **WHEN** the components are generated
- **THEN** the corresponding absolute coordinates in the generated paths MUST be `19.887`, `13.656` and `17.364` respectively
- **AND** each difference MUST be no more than 0.001 units (about 0.001px at 24px)
- **AND** the semantically matched `thaad` coordinate `17.401` MAY round to `17.4`
- **AND** only `tbm-launcher`, `patriot`, `sam-launcher` and `thaad` MUST show any rounding difference

#### Scenario: Coordinates with 3 or fewer decimals are unchanged
- **GIVEN** the 14 new icons whose artifact coordinates all have 3 or fewer decimals (for example `mrap`, `jltv`, `sm2`)
- **WHEN** the components are generated
- **THEN** every absolute coordinate in the generated path MUST equal the artifact value exactly

#### Scenario: Source file is a byte copy of the artifact
- **GIVEN** the artifact files `toolkit-24/<id>.svg`
- **WHEN** `diff` compares each with `src/svg/<name>.svg` (using `mobile-radar.svg` for id `radar`)
- **THEN** all 18 comparisons MUST report no difference

#### Scenario: Artwork stays inside the 24px frame
- **GIVEN** the artifact bounds of 1 to 23 (22px extent) or 2 to 22 (20px square)
- **WHEN** a new icon renders at `viewBox="0 0 24 24"`
- **THEN** no path point MUST fall outside 0 to 24 on either axis

### Requirement: Existing icons and package surface are unchanged

The change SHALL be additive. All 241 existing sources, generated modules, root named exports and subpath keys SHALL be unchanged, and the root `src/index.ts` SHALL keep its current content. The release SHALL be a `minor` version bump of `@accelint/icons`.

#### Scenario: Regeneration leaves existing generated files byte-identical
- **GIVEN** the 241 committed `src/icons/*.tsx` files
- **WHEN** the package is regenerated and rebuilt with the 18 new sources
- **THEN** `git diff --stat` MUST show no modified existing icon `.svg` or `.tsx` file
- **AND** the only diffs MUST be 18 new `.svg` files, 18 new `.tsx` files, added lines in `src/icons/index.ts` and added keys in `package.json` `exports`

#### Scenario: Export map changes are additions only
- **GIVEN** the `package.json` `exports` map before the change
- **WHEN** the build rewrites `exports`
- **THEN** every previous key and target MUST still be present with the same value
- **AND** the 18 new keys (for example `./mobile-radar` -> `./dist/mobile-radar.js`) MUST appear in code-point sort order, with `./package.json` still last

#### Scenario: Existing consumer import keeps working
- **GIVEN** the existing consumer code `import Radar from '@accelint/icons/radar'` and `import * as Icon from '@accelint/icons'` using `Icon.Radar`
- **WHEN** the consumer upgrades to the new release
- **THEN** both MUST compile and render the same output as before

#### Scenario: Version bump is minor
- **GIVEN** the pending changesets, including an existing `patch` for `@accelint/icons`
- **WHEN** the release version is computed
- **THEN** `@accelint/icons` MUST receive a `minor` bump
- **AND** the change MUST NOT add a `major` bump

### Requirement: COP 32px variants are not published by the icons package

`@accelint/icons` SHALL NOT publish the artifact's 18 32px COP variants (`cop-32/<id>.svg`, `viewBox="0 0 32 32"`, `fill="#FF69B4" stroke="#000"`). Only the 24px `currentColor` designs are in scope.

#### Scenario: No 32px or pink-filled source enters the package
- **GIVEN** the artifact files `cop-32/thaad.svg` and `toolkit-24/thaad.svg`
- **WHEN** the package sources are inspected after the change
- **THEN** `src/svg/thaad.svg` MUST equal `toolkit-24/thaad.svg`
- **AND** no source in `src/svg` MUST contain `viewBox="0 0 32 32"` or `#FF69B4` from this change

### Requirement: Storybook icon catalog shows the new icons

The design-toolkit Storybook icon catalog SHALL list the 17 new mobile-platform icons in the `'map dynamic'` category and `aegis-ashore` in the `'map static'` category, each with its kebab-case source name and its generated component. The catalog change SHALL NOT change the design-toolkit build output.

#### Scenario: Catalog lists each new icon under its map category
- **GIVEN** the `Foundation/Icons` story
- **WHEN** it renders the `'map dynamic'` and `'map static'` categories
- **THEN** `'map dynamic'` MUST show an entry named `mobile-radar` rendering `MobileRadar`, an entry named `sm2` rendering `Sm2`, and so on for all 17 mobile-platform icons
- **AND** `'map static'` MUST show an entry named `aegis-ashore` rendering `AegisAshore`
- **AND** each of the 18 names MUST appear exactly once across the catalog
- **AND** the existing `radar` entry MUST still render the existing `Radar` icon in `symbols`

#### Scenario: Catalog change is not shipped in design-toolkit
- **GIVEN** the design-toolkit build excludes `src/icons`
- **WHEN** design-toolkit is built after the catalog change
- **THEN** the design-toolkit `dist` output MUST NOT contain the catalog or any of the 18 new icon names
