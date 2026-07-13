# Packages

This page provides a complete inventory of Standard Toolkit packages with descriptions, key features, and common usage patterns.

## Package Categories

- [UI Components](#ui-components)
- [Geospatial](#geospatial)
- [Utilities](#utilities)
- [Infrastructure](#infrastructure)
- [Assets](#assets)
- [Tooling](#tooling-packages)

---

## UI Components

### @accelint/design-toolkit

**Version:** 9.12.0  
**Description:** 50+ accessible React components for Accelint applications  
**Storybook:** https://design-toolkit.accelint.io/

**Key Features:**
- Full ARIA support and keyboard navigation
- Built on react-aria-components
- Tailwind CSS modules for scoped styling
- Dark mode support
- Classification banner/badge components (government/military UX)

**Component Categories:**

**Forms:**
- text-field, text-area-field, search-field
- select-field, combobox-field
- date-field, time-field, coordinate-field
- checkbox, radio, switch, slider
- color-picker, hotkey
- query-builder

**Data Display:**
- table (with @tanstack/react-table)
- tree (hierarchical data)
- gantt (timeline visualization)
- kanban (drag-and-drop boards)
- details-list (key-value pairs)
- flashcard (flip-card UI)

**Navigation:**
- sidenav (collapsible sidebar)
- breadcrumbs
- tabs
- menu (dropdown, context menu)
- pagination
- link

**Feedback:**
- notice (notification system with queue)
- dialog (modal)
- drawer (slide-out panel)
- tooltip
- popover
- status-indicator

**Layout & Structure:**
- accordion
- carousel
- view-stack (tabbed views)
- divider

**Media:**
- audio, video (with media-controls)
- avatar
- icon

**Interactive:**
- button (with variants: link, toggle, clear)
- action-bar (grouped actions)
- floating-card (draggable card)

**Specialized:**
- classification-banner (site-wide classification label)
- classification-badge (inline classification)
- clock (real-time clock display)
- skeleton (loading placeholders)

**Usage Example:**

```typescript
import { Button } from '@accelint/design-toolkit/components/button';
import { TextField } from '@accelint/design-toolkit/components/text-field';
import { Dialog } from '@accelint/design-toolkit/components/dialog';

function MyForm() {
  return (
    <Dialog>
      <TextField label="Name" />
      <Button>Submit</Button>
    </Dialog>
  );
}
```

**Source:** `/packages/design-toolkit/`

**Recent Changes:**
- Notice component: Added metadata to action callbacks (commit `689852db`)
- Status indicator: New status options (commit `00ce7929`)
- Input height consistency fix (commit `b6b10645`)
- Button hover state fix (commit `7af5e738`)
- Drawer layout and animation fixes (commit `bf3b2996`)

---

### @accelint/design-foundation

**Version:** 0.4.0  
**Description:** Design tokens and CSS utilities for design-toolkit

**Key Features:**
- Design tokens (colors, spacing, typography, shadows)
- CSS utility functions
- Theme system foundation

**Usage:**

```typescript
import { tokens } from '@accelint/design-foundation/tokens';
import { css } from '@accelint/design-foundation/lib/css';
```

**Source:** `/packages/design-foundation/`

---

## Geospatial

### @accelint/map-toolkit

**Version:** 5.2.1  
**Description:** Geospatial visualization components and utilities  
**Storybook:** https://map-toolkit.accelint.io/

**Key Features:**
- deck.gl and maplibre integration
- Camera controls (2D/2.5D with GPU-accelerated transitions)
- Shape editing (polygons, lines, points with transform modes)
- Symbol layers (milsymbol support)
- Cursor coordinate display
- Map mode management (pan, draw, edit)

**Core Modules:**

**Camera (`/camera`):**
- 2D and 2.5D (pitched) view controls
- Pan, zoom, rotate, tilt gestures
- GPU-accelerated transitions
- Programmatic control via `useCamera` hook
- Store: Zustand camera state management

**Shapes (`/deckgl/shapes`):**
- `DisplayShapeLayer`: Read-only shape rendering
- `EditShapeLayer`: Interactive shape editing
- Modes: draw, modify, transform, locked-transform
- Geospatial calculations (distance, area, bearing)

**Base Map (`/deckgl/base-map`):**
- Core map component
- Layer composition
- Interaction handling
- Style and projection management

**Cursor Coordinates (`/cursor-coordinates`):**
- Real-time cursor position tracking
- Format conversion (DD, DDM, DMS, MGRS, GARS)
- Store: Zustand coordinate state

**Map Mode (`/map-mode`):**
- Mode state management (pan, draw, edit, measure)
- Keyboard shortcut integration

**Viewport (`/viewport`):**
- Viewport calculations and transformations

**Usage Example:**

```typescript
import { BaseMap } from '@accelint/map-toolkit/deckgl/base-map';
import { useCamera } from '@accelint/map-toolkit/camera';
import { EditShapeLayer } from '@accelint/map-toolkit/deckgl/shapes/edit-shape-layer';

function MapView() {
  const { viewState, setViewState } = useCamera();
  
  return (
    <BaseMap viewState={viewState} onViewStateChange={setViewState}>
      <EditShapeLayer mode="draw" onShapeComplete={handleShape} />
    </BaseMap>
  );
}
```

**Source:** `/packages/map-toolkit/`

**Recent Changes:**
- GPU-accelerated camera transitions (commit `5f1207f2`)
- Mouse camera controls in 2.5D (commit `fdea8e2d`)
- Wagon wheel bounding box fix (commit `149d975f`)
- Playwright integration tests (commit `ed71829f`)

---

### @accelint/geo

**Version:** 0.6.1  
**Description:** Coordinate system parsing, formatting, and geospatial calculations

**Key Features:**
- Multiple coordinate formats: DD, DDM, DMS, MGRS, GARS
- Coordinate parsing and validation
- Coordinate formatting and conversion
- Geodetic calculations (distance, bearing, destination)

**Coordinate Systems:**

**Decimal Degrees (DD):**
```typescript
import { system } from '@accelint/geo/coordinates/latlon/decimal-degrees/system';

const coord = system.parse('40.7128° N, 74.0060° W');
const formatted = system.format(coord); // "40.7128° N, 74.0060° W"
```

**Degrees Decimal Minutes (DDM):**
```typescript
import { system } from '@accelint/geo/coordinates/latlon/degrees-decimal-minutes/system';

const coord = system.parse('40° 42.768\' N, 74° 0.360\' W');
```

**Degrees Minutes Seconds (DMS):**
```typescript
import { system } from '@accelint/geo/coordinates/latlon/degrees-minutes-seconds/system';

const coord = system.parse('40° 42\' 46.08" N, 74° 0\' 21.6" W');
```

**MGRS (Military Grid Reference System):**
```typescript
import { system } from '@accelint/geo/coordinates/mgrs/system';

const coord = system.parse('18T WL 83812 06617');
```

**Cartesian Calculations:**
```typescript
import { distance, bearing, destination } from '@accelint/geo/cartesian';

const dist = distance([lat1, lon1], [lat2, lon2]); // meters
const brng = bearing([lat1, lon1], [lat2, lon2]);  // degrees
const dest = destination([lat, lon], brng, dist);  // [lat, lon]
```

**Source:** `/packages/geo/`

**Recent Changes:**
- Coordinate field bug fixes (commit `a76da937`)
- DDM/DMS rounding carry fixes

---

## Utilities

### @accelint/core

**Version:** 0.6.0  
**Description:** Functional utility library for arrays, objects, logic, and composition

**Key Features:**
- Immutable array operations
- Object manipulation utilities
- Function composition (curry, pipe, compose)
- Combinators (apply, fork, constant, identity)
- Iterable utilities

**Modules:**

**Array (`/array`):**
```typescript
import { map, filter, reduce } from '@accelint/core/array';

const doubled = map([1, 2, 3], x => x * 2); // [2, 4, 6]
const evens = filter([1, 2, 3, 4], x => x % 2 === 0); // [2, 4]
```

**Composition (`/composition`):**
```typescript
import { pipe, compose, curry } from '@accelint/core/composition';

const add = (a: number, b: number) => a + b;
const multiply = (a: number, b: number) => a * b;

const addThenMultiply = pipe(curry(add)(2), curry(multiply)(3));
addThenMultiply(5); // (5 + 2) * 3 = 21
```

**Combinators (`/combinators`):**
```typescript
import { fork, constant, identity } from '@accelint/core/combinators';

const avg = fork((a, b) => (a + b) / 2, Math.min, Math.max);
avg([1, 2, 3, 4, 5]); // (1 + 5) / 2 = 3
```

**Source:** `/packages/core/`

---

### @accelint/formatters

**Version:** 0.6.0  
**Description:** Data formatting utilities for dates, numbers, strings

**Key Features:**
- Date/time formatting
- Number formatting (currency, percentages, units)
- String formatting (case conversion, pluralization)

**Source:** `/packages/formatters/`

---

### @accelint/converters

**Version:** 0.6.0  
**Description:** Unit conversions and data transformations

**Key Features:**
- Distance units (meters, kilometers, miles, nautical miles)
- Temperature conversions
- Data size conversions
- Custom unit converters

**Source:** `/packages/converters/`

---

### @accelint/temporal

**Version:** 0.6.0  
**Description:** Date and time utilities

**Key Features:**
- Date manipulation
- Time zone handling
- Duration calculations
- Date formatting and parsing

**Source:** `/packages/temporal/`

---

### @accelint/predicates

**Version:** 0.6.0  
**Description:** Type guards and validation predicates

**Key Features:**
- TypeScript type guards (`isString`, `isNumber`, `isArray`, etc.)
- Validation predicates (`isEmail`, `isUrl`, `isUuid`, etc.)
- Type narrowing for TypeScript

**Usage:**

```typescript
import { isString, isNumber } from '@accelint/predicates';

function process(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is string
    return value.toUpperCase();
  }
  if (isNumber(value)) {
    // TypeScript knows value is number
    return value * 2;
  }
}
```

**Source:** `/packages/predicates/`

---

### @accelint/math

**Version:** 0.4.0  
**Description:** Mathematical utilities and calculations

**Key Features:**
- Statistical functions
- Vector operations
- Mathematical constants

**Source:** `/packages/math/`

---

### @accelint/constants

**Version:** 0.4.0  
**Description:** Shared constants across packages

**Key Features:**
- Common constants
- Enumerations
- Configuration values

**Source:** `/packages/constants/`

---

## Infrastructure

### @accelint/bus

**Version:** 0.6.0  
**Description:** Event bus for cross-component communication

**Key Features:**
- Pub/sub pattern
- Type-safe event emission and subscription
- Decoupled component communication

**Usage:**

```typescript
import { createBus } from '@accelint/bus';

type Events = {
  'user:login': { userId: string };
  'user:logout': void;
};

const bus = createBus<Events>();

// Subscribe
bus.on('user:login', ({ userId }) => {
  console.log('User logged in:', userId);
});

// Publish
bus.emit('user:login', { userId: '123' });
```

**Source:** `/packages/bus/`

---

### @accelint/hotkey-manager

**Version:** 0.6.0  
**Description:** Keyboard shortcut management

**Key Features:**
- Global and scoped hotkey registration
- Conflict detection
- Modifier key support (ctrl, alt, shift, meta)
- Hotkey documentation generation

**Usage:**

```typescript
import { useHotkey } from '@accelint/hotkey-manager';

function MyComponent() {
  useHotkey('ctrl+s', () => {
    console.log('Save triggered');
  });
}
```

**Source:** `/packages/hotkey-manager/`

---

### @accelint/logger

**Version:** 0.6.0  
**Description:** Structured logging utilities

**Key Features:**
- Log levels (debug, info, warn, error)
- Contextual logging
- Log formatting and output targets

**Usage:**

```typescript
import { createLogger } from '@accelint/logger';

const logger = createLogger({ name: 'MyApp' });

logger.info('User logged in', { userId: '123' });
logger.error('Failed to save', { error });
```

**Source:** `/packages/logger/`

---

### @accelint/web-worker

**Version:** 0.4.0  
**Description:** Web worker utilities

**Key Features:**
- Typed web worker communication
- Worker lifecycle management
- Message passing utilities

**Source:** `/packages/web-worker/`

---

### @accelint/websocket

**Version:** 0.6.0  
**Description:** WebSocket client utilities

**Key Features:**
- WebSocket connection management
- Automatic reconnection
- Message queuing
- Typed message handling

**Source:** `/packages/websocket/`

---

### @accelint/dataset

**Version:** 0.6.0  
**Description:** Data structure utilities

**Key Features:**
- Immutable data structures
- Data manipulation utilities
- Collection operations

**Source:** `/packages/dataset/`

---

## Assets

### @accelint/icons

**Version:** 0.4.0  
**Description:** SVG icon library

**Key Features:**
- Optimized SVG icons
- React components
- Tree-shakeable imports

**Usage:**

```typescript
import { IconName } from '@accelint/icons';

function MyComponent() {
  return <IconName aria-label="Description" />;
}
```

**Source:** `/packages/icons/`

---

### @accelint/ntds

**Version:** 0.4.0  
**Description:** NATO Tactical Data Standard components

**Key Features:**
- Military symbology
- Tactical display components
- NTDS standard compliance

**Source:** `/packages/ntds/`

---

## Tooling Packages

Tooling packages are internal development tools and are not published to npm.

### @accelint/constellation-tracker

**Version:** 0.2.0  
**Description:** Backstage catalog automation

**Key Features:**
- Auto-generates and maintains `catalog-info.yaml` files
- Scans workspace dependencies
- Integrates with CI and git hooks

**Usage:**

```bash
constellation-tracker
constellation-tracker --regenerate
```

**Source:** `/tooling/constellation-tracker/`

---

### @accelint/biome-config

**Description:** Shared Biome configuration for linting and formatting

**Source:** `/tooling/biome-config/`

---

### @accelint/typescript-config

**Description:** Base TypeScript configuration

**Exports:**
- `tsconfig.base.json` - Base config
- `tsconfig.dist.json` - Distribution build config
- `tsconfig.test.json` - Test config

**Source:** `/tooling/typescript-config/`

---

### @accelint/vitest-config

**Description:** Base Vitest configuration

**Features:**
- Coverage thresholds (80%)
- jsdom environment
- React testing setup

**Source:** `/tooling/vitest-config/`

---

### @accelint/prettier-config

**Description:** Shared Prettier configuration (legacy, transitioning to Biome)

**Source:** `/tooling/prettier-config/`

---

### @accelint/eslint-config

**Description:** ESLint configuration (legacy, transitioning to Biome)

**Source:** `/tooling/eslint-config/`

---

### @accelint/postcss-tailwind-css-modules

**Description:** PostCSS plugin integrating Tailwind with CSS modules

**Purpose:**
- Allows `@apply` in CSS modules
- Scopes Tailwind utilities to components
- Used by design-toolkit

**Source:** `/packages/postcss-tailwind-css-modules/`

---

### @accelint/smeegl

**Description:** Custom tooling utilities

**Source:** `/tooling/smeegl/`

---

### @accelint/turbo-filter

**Description:** Interactive package filter for turbo commands

**Usage:**

```bash
pnpm dev:filter      # Select packages interactively
pnpm preview:filter
```

**Source:** `/tooling/turbo-filter/`

---

## Package Dependency Graph

**Common Dependency Patterns:**

```
design-toolkit
  ├─ design-foundation (tokens, CSS)
  ├─ core (utilities)
  ├─ predicates (type guards)
  ├─ logger (logging)
  ├─ bus (events)
  ├─ converters (data conversion)
  ├─ formatters (formatting)
  └─ temporal (date/time)

map-toolkit
  ├─ design-toolkit (UI components)
  ├─ design-foundation (tokens)
  ├─ geo (coordinate systems)
  ├─ core (utilities)
  ├─ hotkey-manager (shortcuts)
  └─ math (calculations)

geo
  └─ (no internal dependencies)

core
  └─ (no internal dependencies)
```

**External Dependencies:**

All packages depend on:
- React 19 (design-toolkit, map-toolkit)
- TypeScript 5.9
- radashi (modern lodash alternative)

---

## Installation

**Individual Packages:**

```bash
npm install @accelint/design-toolkit
npm install @accelint/map-toolkit
npm install @accelint/geo
```

**Within Monorepo:**

All packages are automatically available via workspace dependencies.

---

## API Documentation

Complete API documentation is available in:
- **Storybook:** Component demos and props documentation
  - Design Toolkit: https://design-toolkit.accelint.io/
  - Map Toolkit: https://map-toolkit.accelint.io/
- **TypeScript Definitions:** Full type definitions in published packages
- **Source Code:** Inline JSDoc comments and `.docs.mdx` files

---

**Related:**
- [Quickstart](./quickstart.md) - Getting started
- [Architecture](./architecture.md) - System design
- [Workflows](./workflows.md) - Development process
- [Operations](./operations.md) - Building and testing
