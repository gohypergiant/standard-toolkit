# @accelint/design-toolkit

## 7.0.0

### Major Changes

- 3d71b8d: Refactored the DesignToolkit so that it does not use the dot syntax anymore. As an example, `Drawer.Header` is now `DrawerHeader` and so on. This change is required to avoid RSC throwing `undefined` errors in some cases when rendering.

  This is a breaking change and will require removing the dot notation from components currently in use in your code base.

  This change also updates the import/export paths for the components. If you are not importing from the root `@accelint/design-toolkit` path, then you will need to update your imports as follows:
  - `RootComponent` goes from `@accelint/design-toolkit/root-component` to `@accelint/design-toolkit/components/root-component/index`
  - `RootComponentHeader` goes from `@accelint/design-toolkit/root-component` to `@accelint/design-toolkit/components/root-component/header`

### Minor Changes

- 5b62458: Removed all component composition validation due to it not working with SSR/RSC
- ea4f348: Updating table component to include documentation and also add event handlers to handle server side logic
- cec6fee: Replace lodash with radashi for performance and build size optimization
- 5ce2a0c: Adds new map-related icons to the icon library set

### Patch Changes

- 842e84a: Updates state styles of select
- 0d697fa: Fixed definitions in package files for longhand repository definitions, while disabling the option in syncpack that changed it.
- d10c518: Memoize the overlay container for tooltip to prevent detached node
- face3c9: Replaces style syntax errors in Checkbox and Tree that were preventing correct style application
- d67c471: Audits state styles of switch
- f031f36: Updates radio state styles
- 0d0edc4: Document the custom value implementation for combobox
- ef52380: bump to node 22
- f5a2a9f: Updates color-picker state styles
- 8d81c70: Updates state styles of option items and menu items plus fixes a semantic token discrepancy
- f99f294: Updated syncpack and realigned all packages for dependency versions
- b5061d2: Updates state styles of checkbox
- 935b8e5: Updated the package names in the Constellation configuration file.
- cfd8d43: Update the width of the select field component
- 0c5e77f: State style updates plus propagates disabled state to slider
- 2f1b9c6: address the console errors/warnings during test runs
- 1c2a622: Updates deletable chip and selectable chip state styles
- Updated dependencies [0d697fa]
- Updated dependencies [f99f294]
- Updated dependencies [935b8e5]
- Updated dependencies [525a5a6]
- Updated dependencies [5ce2a0c]
  - @accelint/icons@2.1.0
  - @accelint/temporal@0.1.2
  - @accelint/core@0.5.0
  - @accelint/bus@2.0.0

## 6.0.0

### Major Changes

- 6d131cd: A refactor introducing breaking changes for the Tooltip component. The structure is now a light wrapper around the [Tooltip](https://react-spectrum.adobe.com/react-aria/Tooltip.html) implementation. Tooltip has been replaced with Tooltip.Trigger and Tooltip.Body has been replaced with Tooltip. Reference the [docs](https://gohypergiant.github.io/standard-toolkit/?path=/docs/components-tooltip--playground) for implementation instructions.
- ac5378e: Changed to new naming system for fontsource.

  Breaking change: This will require changing packages downstream according to the [v5 migration blog](https://fontsource.org/docs/getting-started/migrate-v5) on fontsource.

  Example:

  From this:

  ```json
      "@fontsource/roboto-flex": "^5.2.8",
      "@fontsource/roboto-mono": "^5.2.8",
  ```

  To:

  ```json
      "@fontsource-variable/roboto-flex": "^5.2.8",
      "@fontsource-variable/roboto-mono": "^5.2.8",
  ```

### Minor Changes

- 23ad1db: This release introduces a Notice component to display notifications, alerts, and messages. The implementation includes an individual Notice component for single notifications and Notice.List for queue-based notifications. The system supports five color variants (info, advisory, normal, critical, and serious) with customizable action buttons, automatic timeout management, flexible dequeuing options, and portal-based rendering. View the [Notice component in Storybook](https://gohypergiant.github.io/standard-toolkit/?path=/docs/components-notice--playground) for interactive examples and documentation.
- 0baf4b0: This fixes a memory leak in the ViewStack component that affects the Drawer component causing detached elements.
- ade0504: - export ThemeMode type (light or dark)for use in the ThemeProvider
  - apply bg-surface-default and fg-primary-bold tokens to the html element by default
  - move font-primary token from the body element to the html
- eba4ac3: Adds Clock component

### Patch Changes

- 66ac503: Fixes incorrect link to the Github repository
- 3e47dea: Updates state styles of tree
- 57efc27: Updates state styles for tabs
- d625d2b: Apply story patterns: satisfies, story type alias, meta property ordering
- 1e68e16: Updates state styles of combobox
- fb2852d: add missing docblock comments to publicly exported components
- 5643ee1: Fixed buttons min/max widths being incorrectly applied
- 64280a7: - Released `@accelint/constellation-tracker` - A tool that helps maintain catalog-info.yaml files for Constellation integration
  - Ensures all packages include catalog-info.yaml in their published files for better discoverability and integration with Constellation
  - Provides automated tracking and updating of component metadata across the project
  - Enhanced package metadata to support better integration with internal tooling
- 4d96d59: Fixes an issue where the Slider component had a fixed height instead of being sized according to its content.
- 65a0137: Link state style updates
- d726ad5: Accordion/AccordionGroup variant styling has been updated to address a bug that was not displaying correctly.
- Updated dependencies [66ac503]
- Updated dependencies [ccb2d05]
- Updated dependencies [64280a7]
  - @accelint/icons@2.0.4
  - @accelint/bus@1.4.0
  - @accelint/core@0.4.2
  - @accelint/temporal@0.1.1

## 5.2.0

### Minor Changes

- c6881e4: Adds Table component to DesignTK
- fc4d913: Adds Tooltip to Drawer.Menu.Item via textValue prop
- ff7094f: Removes non-functional `isReadOnly` prop from `SelectField`
- 438fd64: - Fixes discrepancies in color tokens to be more closely aligned with Figma.
  - Updates certain color token primitives to reflect changes.
  - Updates styling for the accordion component to reflect new changes in the Button component, specifically in the pressed state.
  - Removes the hover state for disabled icon button/toggle button
- a302ed8: - Update styling and states for Button, IconButton, ToggleButton
  - Removes support for color variant 'info'
  - Removes support for floating and filled variants for ToggleButton
- d5ee78f: Fixes Drawer.Menu overflow
- b4348ac: Refactors header to add opinionated variant
- 4026632: Adds Breadcrumb component
- b4ef537: Adds Divider component
  - Utilizes Divider in Sidenav as a replacement for custom implementation

### Patch Changes

- 87d6eb1: Applies pressed state style to search-field
- 69b9aff: Adds correct cursor styling to menu-items
- f216426: Creates a pressed state for input
- Updated dependencies [b11870c]
- Updated dependencies [6374c68]
  - @accelint/bus@1.3.0

## 5.1.0

### Minor Changes

- 011a70a: Fix missing client-only import for classification banner
  Normalize tailwind-variant usage across components
- 030bfde: Add Sidenav.Menu component
- 9c4c834: Preserve 'use client' directive

### Patch Changes

- 5206880: Linting fixes only.
- Updated dependencies [5206880]
  - @accelint/core@0.4.1

## 5.0.0

### Major Changes

- 7ab50ad: Major theme updates --
  - Adding theme support for light mode
  - Renaming selected design tokens for light mode compatibility
  - Script for token naming migrations
  - Default accent color update from seafoam green to accelint skyfoam blue
  - Shift to using tailwind utility classes for color to better align with token names

### Minor Changes

- 8505551: Add ActionBar component
- 851cf04: Add Sidenav.Avatar component
- 0f49fbd: Implement both button and toggle button providers
- c433ae0: Add sidenav component with header, item, and divider
- aab4161: Add Sidenav.Link component
- 14102a3: Add link component
- a793f6d: Add missing doc blocks and update existing doc blocks to follow standards
- a526c71: adds <Tree> component
- 37fb8af: Refactor the Tabs compononent to meet style standards

### Patch Changes

- d82e2fe: fix: remove extraneous parameters for event bus
- Updated dependencies [55718af]
  - @accelint/bus@1.2.0
  - @accelint/icons@2.0.3

## 4.0.0

### Major Changes

- 9660517: Removes range slider and implements style standards

### Minor Changes

- f03040f: Refactor dialog to meet style standards
- 9d576f8: Update to latest react-aria-components version 1.12.1

### Patch Changes

- 2848d9b: Remove unnecessary global selectors
- 7e56878: Added a utility method to run Tailwind Merge across variants.
- Updated dependencies [e767f7c]
  - @accelint/bus@1.1.0

## 3.0.0

### Major Changes

- 57d61c4: Added docblocks; removed Box component

### Minor Changes

- e06fb14: Consolidate button styles to reduce complexity
- 0d92211: refactor button colors
- d3dcc87: Refactored Drawer to be event driven

### Patch Changes

- 13c065b: Made Menu Section title conditionally rendered
- a7da3db: added labelPosition prop to Switch component
- cd684ca: Fixed Combobox styles
- 0701f3b: Fixed default Input size
- f6d0be1: Switch to using focus visible for most focus states
- ed09b0d: Added back in missing default for color of buttons
- Updated dependencies [cdd91b3]
- Updated dependencies [0457dc6]
  - @accelint/core@0.4.0
  - @accelint/bus@1.0.0

## 2.6.0

### Minor Changes

- a97d386: Update Menu component to accept custom triggers
  Add Hotkey component
- 9ec4cbe: Adds <select> component

### Patch Changes

- 83104ea: Refactored ViewStack to be event driven, allowing for triggers anywhere in the app
- Updated dependencies [83104ea]
- Updated dependencies [83104ea]
  - @accelint/core@0.3.0
  - @accelint/icons@2.0.3
  - @accelint/bus@0.1.2

## 2.5.0

### Minor Changes

- 5404e48: Refactor SearchField to follow styling standards
- 61a55ef: Add drawer

### Patch Changes

- 11a813f: Fix css grid formatting for menu
- 7481c80: Update Options to follow DesignTK styling standards
- a201c50: Updated types and fixtures in query builder to fix build
- de8c60a: remove duplicative type prop from TextField
- 484c14f: Added default text color for filled buttons
- a16fbf3: - Created DetailsList component
  - Created Hero component
  - Created Skeleton component
  - Simplified types
  - Implemented missing tests
  - Updated component structure validation functions to exit early in production
  - Expanded component structure validation functions to handle RACs, functions and Fragments
- c95e5b4: allow children
- Updated dependencies [ca3922a]
  - @accelint/icons@2.0.2

## 2.4.3

### Patch Changes

- 382bbc2: Fixes a build issue caused by an import with trailing character in `components/avatar/index.tsx`.

## 2.4.2

### Patch Changes

- 93b3750: Fixed controlled usage of field input

## 2.4.1

### Patch Changes

- f57cb86: Adds fallback for some css tokens
- 4fa066a: - Converted Input autoSize behavior to an optional prop variant
  - Lowered custom variant selector specificity to reduce friction of overrides
  - Fixed Checkbox styling for state of indeterminate + disabled

## 2.4.0

### Minor Changes

- fe10a47: Adds the <menu> component

### Patch Changes

- 4dd70f2: - Add Input component with automatic resizing
  - Refactor TextField to new style standard and to use new Input
  - Fix Checkbox foreground color
  - Fix outline inset
  - Add typography spacing tokens
- c16b479: Removed plural naming for shadow tokens
- 51422c1: Remove menu icon and menu keyboard exports
- 9421185: Remove Menu.Item.Icon and Menu.Item.Keyboard and cleanup styles
- a502977: Fix accordion icon not flipping
- 34f3d91: - Flattened token folder structure for easier use within DesignTK
  - Added group names to deconflict Tailwind groups
  - Converted size to variant selector
  - Added missing provider
- f9e0cac: Refactored Avatar & Badge to new styling standard

## 2.3.2

### Patch Changes

- ad067b2: - Update DesignTK Checkbox to follow styling standards
  - Remove Checkbox and Radio icons due to not being implementable as-is
- Updated dependencies [ad067b2]
  - @accelint/icons@2.0.1

## 2.3.1

### Patch Changes

- 32b4176: Fixes incorrect pluralization of icons css vars

## 2.3.0

### Minor Changes

- 56e2555: add script to build phase to generate css vars and ts variables for tokens to ensure a single source of truth

### Patch Changes

- 8879858: Refactor component styles to use variant selectors
- 8440a09: Refactored buttons to share styles
- 038f012: Replaced RAC TW plugin with custom variants that merge with CSS pseudo classes making variant selectors agnostic of RAC
- 6bf21ea: Refactored TextArea to be consistent in standards
- 0e0125a: - Refactored Chip to conform to new standards
  - Added Chip context provider
  - Swapped Chip span out for div for consistency
- 0089039: Conditionally render icon containers in OptionsItem
- 61488e3: Refactor Radio to follow styling standards
- b283521: refactor classification banner to use tailwind-variants
- aca19ec: refactor classification badge component to use twv
- 8b0d1eb: - Refactored Label & Switch to be consistent in standards
  - Swapped Label isOptional for isRequired for consistency
  - Added contexts and providers
- c83d321: Simplified Accordion styles based on variant selectors

## 2.2.1

### Patch Changes

- 0fd9e71: Fixes an issue where certain components were not properly marked as client components.

## 2.2.0

### Minor Changes

- 301e690: Add popover component
- 006587b: Set default to primary font

### Patch Changes

- 1f3c039: Ensure complete exports

## 2.1.0

### Minor Changes

- 9a5eff5: Added slider and range slider component
- 3f382f2: Update react-aria-component and associated libraries to latest
- e1ca0ad: added options component

### Patch Changes

- cb2ec56: - Established new styling standard for DesignTK
  - Converted DesignTK Tailwind prefix from ai- to dtk-
  - Made object member casing more flexible and consistent across all packages
  - Upgraded TS types for React to be consistent and fix type conflicts
- 6f4aad2: - Updated Icon to use separated styles
  - Added Icon provider for easy prop spreading to multiple Icons
  - Handled style overrides from parent and locally
  - Added icon size vars to config to globalize mapping

## 2.0.0

### Minor Changes

- 3c9a57a: Added the Tabs component along with its subcomponents
- 283cc55: Add SearchField component
- 3e374a2: Add <QueryBuilder> component
- a0c80d0: added DateField component
- e92adc6: Added the Dialog component.
- 3b9c678: added ColorPicker component to DesTK

### Patch Changes

- 5ee48c2: fixed combobox layout
- 3e374a2: Added the ComboBox component.
- Updated dependencies [6d07b28]
  - @accelint/icons@2.0.0

## 1.0.1

### Patch Changes

- 0c66cab: added virtualizer to combobox component
- 032e278: Added the ComboBox component.

## 1.0.0

### Patch Changes

- 1cab20a: Updated the TextField and TextArea components to also pass props down to the underlying HTML elements.
- Updated dependencies [4974392]
  - @accelint/icons@1.1.0

## 0.0.2

### Patch Changes

- 777e708: Adds the Checkbox and Checkbox.Group components
- cedce42: Added the <Accordion> and <Accordion.Group> components to the design system.
- 0ed1888: Added the TextField component.
- c5fbdbd: Added the <Switch> component.
- 06fc5c9: Added the Radio and Radio.Group components.
- ca58974: Added the initial scaffolding for documentation to the existing components.
- c5186e8: Added the <TextArea> component.
- 636e3dc: Updated dependencies.
- Updated dependencies [0278535]
  - @accelint/icons@2.0.0

## 0.0.1

### Patch Changes

- 4047209: Initial Release
