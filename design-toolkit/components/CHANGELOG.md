# @accelint/design-toolkit

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
