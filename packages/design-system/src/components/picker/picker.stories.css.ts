import { style } from '@vanilla-extract/css';
import { semanticColorVars, sizeVars } from '../../styles';
import { assignPartialVars, containerQueries } from '../../utils';
import { pickerItemColorVars, pickerItemStateVars } from './picker.css';
import type { PickerItemState } from './types';

export const colorPickerItem = style({
  width: 16,
  height: 16,
  padding: sizeVars.v01,
  '@container': containerQueries<PickerItemState>(
    pickerItemStateVars,
    {
      query: { operator: 'or', isHovered: true, isPressed: true },
      vars: assignPartialVars(pickerItemColorVars, {
        border: semanticColorVars.border.interactive.hover,
      }),
    },
    {
      query: { isSelected: true },
      vars: assignPartialVars(pickerItemColorVars, {
        border: semanticColorVars.border.interactive.highlight,
      }),
    },
  ),
});

export const colorSwatch = style({
  width: '100%',
  height: '100%',
});

export const iconPickerItem = style({
  vars: assignPartialVars(pickerItemColorVars, {
    color: semanticColorVars.foreground.interactive.primary.subtle,
  }),
  '@container': containerQueries<PickerItemState>(
    pickerItemStateVars,
    {
      query: { operator: 'or', isHovered: true, isPressed: true },
      vars: assignPartialVars(pickerItemColorVars, {
        color: semanticColorVars.foreground.interactive.primary.bold,
      }),
    },
    {
      query: { isSelected: true },
      vars: assignPartialVars(pickerItemColorVars, {
        color: semanticColorVars.foreground.interactive.highlight,
      }),
    },
  ),
});
