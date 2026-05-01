---
"@accelint/map-toolkit": minor
---

Fix rotated rectangles distorting into parallelograms during edit. Rectangles now use a new `'rectangle-transform'` edit mode (`RectangleTransformMode` + `RectangleScaleMode`) that places scale handles at the rectangle's actual rotated corners and projects corner drags onto the rectangle's local edges in Mercator space, so rotation is preserved through any scale gesture. The rotate handle now sits on the rectangle's currently-northern edge midpoint instead of the axis-aligned bbox. Hold Shift while dragging a corner to scale uniformly (preserve aspect ratio) - same Shift behavior as before.

**Note for consumers:** the edit-mode value the store assigns to a `RectangleShape` changes from `'bounding-transform'` to `'rectangle-transform'`. If you read `editingState.editMode` and compare against `'bounding-transform'` for a rectangle, update those checks to also accept `'rectangle-transform'` (or rely on `getEditModeForShape` / `useEditShape` to pick the right mode for you).
