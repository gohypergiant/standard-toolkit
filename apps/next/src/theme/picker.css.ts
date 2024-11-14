import { style } from '@vanilla-extract/css';
import {
  type PickerState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  pickerSpaceVars,
  pickerStateVars,
  sizeVars,
} from '@accelint/design-system/vanilla';

export const Picker: ThemeContext['Picker'] = {
  list: {
    list: style(
      applyThemeVars<PickerState>(pickerStateVars, [
        {
          vars: assignPartialVars(pickerSpaceVars, {
            gap: sizeVars.v04,
          }),
        },
      ]),
    ),
  },
};
