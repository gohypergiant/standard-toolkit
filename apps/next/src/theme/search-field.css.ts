import { style } from '@vanilla-extract/css';
import {
  type InputState,
  type SearchFieldState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  inputStateVars,
  layers,
  inputColorVars,
  searchFieldSpaceVars,
  searchFieldStateVars,
  semanticColorVars,
  sizeVars,
} from '@accelint/design-system/vanilla';

export const SearchField: ThemeContext['SearchField'] = {
  group: style(
    applyThemeVars<SearchFieldState>(searchFieldStateVars, [
      {
        vars: assignPartialVars(searchFieldSpaceVars, {
          x: sizeVars.v04,
          y: sizeVars.v03,
        }),
      },
    ]),
  ),
  input: {
    sizer: style(
      applyThemeVars<{ search: SearchFieldState; input: InputState }>(
        { search: searchFieldStateVars, input: inputStateVars },
        [
          {
            query: { search: { variant: 'solid' } },
            vars: assignPartialVars(inputColorVars, {
              background: semanticColorVars.background.surface.raised,
            }),
          },
          {
            query: {
              search: { variant: 'solid' },
              input: {
                isHovered: false,
                isFocused: false,
                isInvalid: false,
              },
            },
            vars: assignPartialVars(inputColorVars, {
              border: semanticColorVars.background.surface.raised,
            }),
          },
        ],
        layers.variables.l2,
      ),
    ),
  },
};
