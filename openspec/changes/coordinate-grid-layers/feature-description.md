# Coordinate Grid Layers - Product Feature Description

## Overview

This feature adds **coordinate grid visualization** to the Map Toolkit. Users will be able to display reference grids overlaid on the BaseMap. These grids help users identify and communicate specific locations using standardized coordinate systems. These location grids allow for precise navigation, military operations or when other precision geographic analysis is needed. 

## Supported Grid Systems

### GARS (Global Area Reference System)
A worldwide grid system that divides the Earth into 30-minute cells, further subdivided into 15-minute and 5-minute cells. Each cell has a unique identifier like "006AG39". These are general purpose reference grids for applications needing straightforward hierarchical coordinate identification.

### MGRS (Military Grid Reference System)
A military-standard grid system based on UTM zones, with nested grids at 100km, 10km, and 1km precision. Each location has an identifier like "18TWL8081".

---

## Visual Behavior

### What Users See

**Grid Lines:**
- Visible grid lines that form cells on the map
- Lines appear and disappear automatically as users zoom in and out
- Different grid sizes at different zoom levels (zoomed out = larger cells, zoomed in = smaller cells)
- Multiple grid sizes can be visible simultaneously for context

**Labels:**
- Optional text labels showing each cell's coordinate identifier
- Labels appear in the center of each cell
- Can be turned on/off
- Only show when zoomed in enough to be readable

**Visual Design:**
- Default styling: dark color palette that contrasts with map tiles
- Larger/coarser grids have thicker, darker lines
- Smaller/finer grids have thinner, lighter lines
- Progressive visual hierarchy makes it easy to distinguish grid sizes

### Zoom-Based Behavior

**GARS Grid:**
| Zoom Level | What's Visible |
|------------|----------------|
| 0-6 (World → Continent) | Nothing (too zoomed out) |
| 6-8 (Continent → Country) | 30-minute cells (large) |
| 8-12 (Country → City) | 15-minute cells (medium) |
| 12-20 (City → Street) | 5-minute cells (small) |

**MGRS Grid:**
| Zoom Level | What's Visible |
|------------|----------------|
| 0-4 (World → Continent) | GZD zones only |
| 4-8 (Continent → Country) | GZD + 100km grids |
| 8-11 (Country → Region) | GZD + 100km + 10km grids |
| 11-20 (City → Street) | All grids including 1km |

**Note:** These zoom levels are configurable - applications can adjust them to fit their needs.

---

## User Interactions

### Hovering Over Cells
- When a user hovers their cursor over a grid cell, the application can respond (e.g., highlight the cell, show a tooltip with coordinates)
- The system tracks which cell the user is currently hovering over
- No duplicate events when hovering within the same cell (performance optimization)

### Clicking on Cells
- When a user clicks on a grid cell, the application can respond (e.g., select the cell, show details, navigate)
- Click events include both the cell identifier and the exact click location

### Selecting Cells
- Applications can implement cell selection (single or multiple cells)
- The system tracks which cells are selected/deselected
- Selection state management is handled by the application (not built into the grid layer itself)

### Event Information Provided
All interaction events include:
- **Cell identifier** (e.g., "006AG39" for GARS)
- **Grid type** (which grid system and precision level)
- **Coordinates** (geographic location)
- **Map ID** (supports multiple maps in the same application)

---

## Customization Options

### Styling
Users can customize the appearance of any grid type:

**Grid Lines:**
- Line color (any color format: red, #FF0000, RGB values)
- Line width (thickness)
- Transparency/opacity

**Labels:**
- Text color
- Font size
- Font family (e.g., Arial, Helvetica)
- Background color and padding (for readability)
- Text positioning/alignment

**Partial Overrides:**
Users can customize just one property (e.g., change line color to red) while keeping all other defaults intact. They don't need to reconfigure everything.

### Zoom Ranges
Users can control when each grid type appears:

**Per-Grid Configuration:**
- Minimum zoom level (when grid appears)
- Maximum zoom level (when grid disappears)
- Label minimum zoom (when labels appear - can be different from lines)

**Overlapping Ranges:**
Multiple grid sizes can be visible at the same time. For example, showing both 100km and 10km MGRS grids at zoom level 10 for context.

**Use Cases:**
- Show fine grids earlier for detail-oriented applications
- Hide grids at extreme zoom levels for performance
- Adjust ranges based on map tile style or screen resolution

### Enabling/Disabling Features
- **Labels:** Turn on/off with a single toggle
- **Events:** Disable hover/click events if not needed (performance optimization)

---

## Technical Deliverables

### For Developers
- **Two reusable map layers:** GARSLayer and MGRSLayer
- **Documentation:** How-to guides, API reference, code examples
- **Storybook demos:** Interactive examples showing all features
- **TypeScript support:** Full type checking and autocomplete

### Integration
- **Works with existing maps** in our toolkit
- **Event system integration** for user interactions
- **React support** for applications using React framework
- **Tree-shakable** (only loads what's used to keep bundle size small)

### Performance
- **Optimized rendering:** Only draws cells visible in current viewport
- **Smooth interactions:** No lag when panning/zooming
- **Memory efficient:** No memory leaks during extended use

---

## Scope and Limitations

### What's Included (v1)
✅ GARS grid system (3 precision levels)
✅ MGRS grid system (4 precision levels)
✅ Customizable styling (colors, widths, fonts)
✅ Configurable zoom ranges
✅ Interactive events (hover, click, selection)
✅ Label display with optional backgrounds
✅ Performance optimizations for large viewports
✅ Complete documentation and examples

### What's NOT Included (Future Considerations)
❌ UTM grid system (different coordinate system)
❌ H3 grid system (hexagonal grid)
❌ S2 grid system (spherical geometry)
❌ USNG grid system (US National Grid)
❌ Visual selection overlay (highlighting selected cells)
❌ Built-in UI controls (buttons, menus for grid settings)
❌ Measurement tools (distance, area calculations)
❌ Coordinate conversion utilities
❌ Grid data export (saving cell boundaries)

**Note:** These are potential future enhancements based on demand. The architecture is designed to make adding new grid systems straightforward.

---

## Use Cases

### Example Applications

**Search and Rescue:**
- Display MGRS grids for coordinating search areas
- Teams can reference grid cells by ID ("Search zone 18TWL8081")
- Click cells to assign them to teams

**Military Operations:**
- Show MGRS grids matching standard military maps
- Communicate positions using standard grid references
- Hover to preview cell identifiers

**Aviation:**
- Display GARS grids for flight planning
- Reference areas by GARS identifiers in communications
- Customize grid colors to contrast with flight routes

**Land Management:**
- Visualize survey grids or management zones
- Label cells for reference in reports
- Adjust zoom ranges for different map scales

**General Mapping:**
- Add reference grids to any map-based application
- Help users identify and communicate locations
- Customize appearance to match application design

---

## User Experience Summary

**Default Experience (Zero Configuration):**
Users add a grid layer to their map with one line of code. It immediately displays with sensible defaults:
- Grid lines appear at appropriate zoom levels
- Professional styling that works with most map tiles
- Labels shown when zoomed in enough to read
- Smooth performance without configuration

**Customized Experience:**
Users can optionally customize:
- Visual appearance (colors, widths, fonts)
- When grids appear (zoom ranges)
- Which features are enabled (labels, events)

**Interactive Experience:**
Users can hover and click on cells, with the application responding to these interactions (highlighting, selecting, showing details, etc.)

**The goal:** Make it trivially easy to add reference grids to any map, with full customization available when needed.
