---
"@accelint/map-toolkit": minor
---

Add CoffinCornersExtension for icon selection/hover bracket indicators

New deck.gl LayerExtension that renders bracket corner indicators around
selected and hovered icons via GPU shaders. Includes useCoffinCorner hook
for managing selection state, event bus integration, and configurable
highlight colors. SymbolLayer fiber type now includes CoffinCornersExtension
props by default.
