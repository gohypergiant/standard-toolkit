# `@accelint/map-toolkit/deckgl/text-layer`

A Deck.gl text layer with enhanced styling capabilities including customizable fonts, colors, stroke, and extended character set support.

The `TextLayer` wraps Deck.gl's `TextLayer` with [opinionated defaults](./default-settings.ts) and an [expanded character set](./character-sets.ts). Smaller character subsets are available for performance optimization.

## Features

- Customizable font styling (size, weight, family, line height)
- White text with black outline by default
- Extended character set support
- Performance-optimized character subsets available

## Usage

```typescript
import { Deck } from '@deck.gl/core';
import { TextLayer } from '@accelint/map-toolkit/deckgl/text-layer';

const layer = new TextLayer({
  id: 'TextLayer',
  data: [
    { position: [-122.4, 37.74], text: 'Hello World!' },
    { position: [-122.3, 37.75], text: 'Extended: àáâãäå' }
  ],
  getText: (d) => d.text,
  getPosition: (d) => d.position,
  
  // Styling options
  getSize: 10, // Font size in pixels (can also be a function: d => d.fontSize)
  fontWeight: 500,
  fontFamily: 'Arial, sans-serif',
  lineHeight: 1.2,
  
  // Colors - provide a Color array directly or a function that returns a Color array
  getColor: [255, 255, 255, 255], // White text
  
  // Stroke
  outlineWidth: 1,
  outlineColor: [0, 0, 0, 255], // Black outline
});

new Deck({
  initialViewState: {
    longitude: -122.4,
    latitude: 37.74,
    zoom: 11
  },
  controller: true,
  layers: [layer]
});
```

### React Fiber Integration

Easy integration with the [DeckGL Fiber Renderer](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main):

```typescript
import '@accelint/map-toolkit/deckgl/text-layer/fiber';

export function TextLabelsLayer() {
  const data = useTextData();

  return (
    <textLayer 
      data={data} 
      getSize={10}
      fontWeight={500}
      lineHeight={1.2}
      outlineWidth={1}
      outlineColor={[0, 0, 0, 255]}
    />
  );
}
```

## Performance

### SDF Text Rendering

The layer uses SDF (Signed Distance Field) rendering by default for better performance and scalability. SDF allows text to scale smoothly at different zoom levels without quality loss. You can customize SDF rendering through `fontSettings`:

```typescript
new TextLayer({
  // ...
  fontSettings: {
    fontSize: 16,
    sdf: true,
    buffer: 4,      // Larger buffer = better quality (default: 4, range: 2-12)
    cutoff: 0.25,   // Edge threshold (default: 0.25, range: 0-1)
    smoothing: 0.1, // Anti-aliasing amount (default: 0.1, range: 0-1)
  }
});
```

**Buffer**: Controls the glyph atlas texture size. Larger values improve rendering quality but use more memory.
**Cutoff**: Determines where the edge of the glyph is drawn. Higher values make text appear bolder.
**Smoothing**: Controls anti-aliasing. Lower values create sharper edges; higher values create smoother edges.

For maximum text sharpness, use `sdf: false` to disable SDF rendering, though this reduces scalability.

### Character Sets
- **Use `ASCII_ALL`** for better performance with ASCII-only text
- **Large character sets** (like `EXPANDED`) may impact initial rendering
- **Use `AUTO`** for dynamic character set optimization based on content

### Best Practices
- Use static colors when they don't change per data point
- Keep `fontFamily` values consistent to avoid loading overhead
- Batch similar text styling to reduce layer instances

## Troubleshooting

**Text not rendering:**
- Ensure `data` array is not empty
- Verify `getText` and `getPosition` return valid values
- Check color values are in `[r,g,b,a]` format (0-255)

**Blurry text:**
- **Enable device pixel ratio**: Set `useDevicePixels={true}` on the `Deckgl` component for crisp rendering on high-DPI displays
- Ensure proper viewport device pixel ratio configuration
- Check `getSize` returns appropriate pixel values for zoom level
- Consider adjusting SDF settings: `buffer`, `cutoff`, and `smoothing` in `fontSettings`
- Increase font size for better clarity at lower zoom levels

**Missing characters:**
- Verify character set includes all needed characters
- Use `CHARACTER_SETS.EXPANDED` or `AUTO` for international text
- Check browser console for character set warnings

**Performance issues:**
- Use smaller character sets (`ASCII_ALL` vs `EXPANDED`)
- Reduce unique `fontFamily` values
- Consider text level-of-detail based on zoom

## Examples

Interactive Storybook examples are available demonstrating:

- Basic text layer usage
- Styled text with custom fonts and outlines
- Per-item color customization
- Multiple layers composed together

Run `pnpm --filter @accelint/map-toolkit run preview` from the monorepo root to view the interactive Storybook examples.
