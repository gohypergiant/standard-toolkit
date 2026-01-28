# `@accelint/icons`

An open-source icon library serving as part of the Accelint UX ecosystem. This package contains 230+ optimized SVG icons converted to React components for seamless integration into React applications.

## Features

- **Tree-Shakeable**: Import only the icons you need
- **TypeScript Support**: Full type definitions included
- **Accessible**: Built-in title prop support for screen readers
- **Customizable**: Icons inherit color and can be sized via CSS
- **Optimized**: SVGs are processed with SVGO for minimal file size
- **Consistent**: All icons use a 24x24 viewBox for uniform sizing

## Installation

```bash
pnpm add @accelint/icons
```

## Usage

### Basic Import

Import icons using named imports for optimal tree-shaking:

```tsx
import { Add } from '@accelint/icons/add';
import { Search } from '@accelint/icons/search';
import { Settings } from '@accelint/icons/settings';

export function MyComponent() {
  return (
    <div>
      <Add />
      <Search />
      <Settings />
    </div>
  );
}
```

### With Accessibility

Use the `title` and `titleId` props for screen reader support:

```tsx
import { Alert } from '@accelint/icons/alert';

export function AlertMessage() {
  return (
    <Alert
      title="Warning notification"
      titleId="alert-icon"
      aria-labelledby="alert-icon"
    />
  );
}
```

### Styling Icons

Icons inherit the current text color and can be styled using CSS classes or inline styles.

**Using CSS Classes (Tailwind):**

```tsx
import { Check } from '@accelint/icons/check';

export function SuccessIcon() {
  return <Check className="text-green-500 w-6 h-6" />;
}
```

**Using Inline Styles:**

```tsx
import { Alert } from '@accelint/icons/alert';

export function WarningIcon() {
  return (
    <Alert
      style={{ color: '#ef4444', width: '24px', height: '24px' }}
    />
  );
}
```

**Inheriting Parent Color:**

```tsx
export function ColoredButton() {
  return (
    <button className="text-blue-600">
      <Search className="w-5 h-5" />
      Search
    </button>
  );
}
```

**Key Styling Properties:**
- **Color**: Icons use `currentColor` for fill, so they inherit the text color from their parent or can be styled directly
- **Size**: Control size using `width` and `height` via CSS classes or inline styles
- **Stroke**: Icons are designed with `fill="none"` by default; paths define the icon shape

### TypeScript Support

All icons are fully typed and accept standard SVG element props:

```tsx
import type { SVGProps } from 'react';
import { Dashboard } from '@accelint/icons/dashboard';

interface IconButtonProps {
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
}

export function IconButton({ icon: Icon, label }: IconButtonProps) {
  return (
    <button>
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}

// Usage
<IconButton icon={Dashboard} label="Dashboard" />
```

## Available Icons

This package includes 230+ icons across various categories:

- **UI Controls**: Add, Remove, Edit, Delete, Settings, Search, Filter
- **Navigation**: Arrow (all directions), Chevron (all directions), Expand, Collapse
- **Media**: Play, Pause, Record, Stop
- **Communication**: Message, Phone, Bell, Share
- **Status**: Alert, Warning, Success, Information, Error
- **Files**: Import, Export, Attach, Copy, Paste
- **Domain-Specific**: Radar, Aircraft, Ships, Military symbols, Weather

For a complete list of available icons, see the [package exports](./package.json) or explore the [src/svg](./src/svg) directory.

### Icon Naming Convention

Icons use kebab-case naming:
- File: `arrow-left.svg` → Import: `@accelint/icons/arrow-left` → Component: `ArrowLeft`
- File: `add-fill.svg` → Import: `@accelint/icons/add-fill` → Component: `AddFill`

## Design Guidelines

### Icon Specifications

- **ViewBox**: All icons use a `24x24` viewBox
- **Grid**: Icons are designed on a 24x24 pixel grid
- **Stroke Width**: Consistent stroke widths across icon set
- **Color**: Monochrome design using `currentColor` (inherits text color)

### Best Practices

1. **Sizing**: Use consistent icon sizes within your application (e.g., 16px, 20px, 24px)
2. **Spacing**: Maintain adequate padding around icons for touch targets
3. **Accessibility**: Always provide `title` prop for standalone icons
4. **Color Contrast**: Ensure sufficient contrast between icon color and background
5. **Loading**: Icons are lightweight, but consider lazy loading for pages with many icons

### Example: Consistent Icon Sizing

```tsx
// Define standard sizes
const iconSizes = {
  sm: 'w-4 h-4',   // 16px
  md: 'w-5 h-5',   // 20px
  lg: 'w-6 h-6',   // 24px
  xl: 'w-8 h-8',   // 32px
} as const;

// Use consistently
<Search className={iconSizes.md} />
<Settings className={iconSizes.lg} />
```

## Contributing

### Adding New Icons

1. **Add SVG File**: Place your SVG file in `src/svg/` directory
2. **SVG Requirements**:
   - ViewBox must be `0 0 24 24`
   - Primary color should be `#898989` (will be converted to `currentColor`)
   - Remove unnecessary attributes (SVGR will optimize)
   - Ensure paths are properly closed

3. **Generate React Components**:
```bash
pnpm generate:icons
```

This runs SVGR to convert SVGs to React components in `src/icons/`.

4. **Build and Test**:
```bash
pnpm build
pnpm test  # If tests exist
```

### SVGR Configuration

Icon generation is configured in [svgr.config.mjs](./svgr.config.mjs):

- **Optimization**: SVGO preset with custom overrides
- **Color Replacement**: `#898989` → `currentColor`
- **Props**: Expands props, includes title prop
- **Output**: TypeScript React components with JSX runtime

### Build Process

The build process follows these steps:

1. `pnpm generate:icons` - Converts SVG files to React components using SVGR
2. `pnpm tsdown` - Bundles TypeScript to JavaScript with type definitions
3. `pnpm run license` - Adds license headers to generated files
4. `pnpm run format` - Formats output files with Biome

## License

Apache-2.0

## Repository

[GitHub: gohypergiant/standard-toolkit](https://github.com/gohypergiant/standard-toolkit)
