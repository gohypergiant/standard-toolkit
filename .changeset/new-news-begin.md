---
"@accelint/design-toolkit": minor
---

Added clear button functionality to ComboBoxField component. The clear button appears when the input has a value and allows users to quickly clear the input. 

New props:
- `isClearable` (boolean, default: true) - Controls whether the clear button is shown

The clear button can be triggered by clicking the button or pressing Escape when the input is focused and not empty. The button is automatically hidden in read-only mode and respects the disabled state.

Additionally, the Input component has been optimized to use a shared internal ClearButton component, reducing style overhead.
