import { style } from '@vanilla-extract/css';
import {
  type ChipState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  chipColorVars,
  chipSpaceVars,
  chipStateVars,
  genericColorVars,
  sizeVars,
} from '../../src';

export const Chip: ThemeContext['Chip'] = {
  list: style({
    vars: assignPartialVars(chipSpaceVars, {
      list: {
        gap: sizeVars.v04,
      },
    }),
  }),
  chip: style(
    applyThemeVars<ChipState>(chipStateVars, [
      {
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.condition.base.v5,
          border: genericColorVars.condition.base.v3,
          color: genericColorVars.neutral.v01,
        }),
      },
      {
        query: { size: 'sm' },
        vars: assignPartialVars(chipSpaceVars, {
          chip: {
            x: sizeVars.v04,
            y: sizeVars.v02,
            gap: sizeVars.v02,
          },
        }),
      },
      {
        query: { size: 'lg' },
        vars: assignPartialVars(chipSpaceVars, {
          chip: {
            x: sizeVars.v05,
            y: sizeVars.v03,
            gap: sizeVars.v03,
          },
        }),
      },
      {
        query: {
          operator: 'or',
          allowsRemoving: true,
          selectionMode: ['single', 'multiple'],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.neutral.v09,
          border: genericColorVars.neutral.v05,
        }),
      },
      {
        query: {
          operator: 'or',
          isHovered: true,
          isPressed: true,
        },
        vars: assignPartialVars(chipColorVars, {
          border: genericColorVars.neutral.v01,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'primary',
            },
            {
              operator: 'or',
              selectionMode: 'none',
              isSelected: true,
            },
          ],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.highlight.primary.v5,
          border: genericColorVars.highlight.primary.v3,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'secondary',
            },
            {
              operator: 'or',
              selectionMode: 'none',
              isSelected: true,
            },
          ],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.highlight.secondary.v5,
          border: genericColorVars.highlight.secondary.v3,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'tertiary',
            },
            {
              operator: 'or',
              selectionMode: 'none',
              isSelected: true,
            },
          ],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.highlight.tertiary.v5,
          border: genericColorVars.highlight.tertiary.v3,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'advisory',
            },
            {
              operator: 'or',
              selectionMode: 'none',
              isSelected: true,
            },
          ],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.condition.advisory.v5,
          border: genericColorVars.condition.advisory.v3,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'affirmative',
            },
            {
              operator: 'or',
              selectionMode: 'none',
              isSelected: true,
            },
          ],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.condition.affirmative.v5,
          border: genericColorVars.condition.affirmative.v3,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'serious',
            },
            {
              operator: 'or',
              selectionMode: 'none',
              isSelected: true,
            },
          ],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.condition.serious.v5,
          border: genericColorVars.condition.serious.v3,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'critical',
            },
            {
              operator: 'or',
              selectionMode: 'none',
              isSelected: true,
            },
          ],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.condition.critical.v5,
          border: genericColorVars.condition.critical.v3,
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.neutral.v07,
          border: genericColorVars.neutral.v05,
          color: genericColorVars.neutral.v05,
        }),
      },
    ])
  ),
};
