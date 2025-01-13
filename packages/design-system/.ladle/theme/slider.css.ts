import { style } from '@vanilla-extract/css';
import {
  type SliderState,
  // type SliderThumbState,
  applyThemeVars,
  assignPartialVars,
  defaultRadiusVarValues,
  defaultSizesVarValues,
  genericColorVars,
  semanticColorVars,
  sliderColorVars,
  sliderSpaceVars,
  sliderStateVars,
  sliderThumbStateVars,
  sliderTrackStateVars,
  type ThemeContext,
} from '../../src';
import type { SliderThumbState } from '../../src/components/slider/types';

export const Slider: ThemeContext['Slider'] = {
  slider: {
    container: style(
      applyThemeVars<SliderState>(sliderStateVars, [
        {
          vars: assignPartialVars(sliderSpaceVars, {
            gridGap: defaultSizesVarValues.v04,
          }),
        },
      ]),
    ),
    min: style(
      applyThemeVars<SliderState>(sliderStateVars, [
        {
          vars: assignPartialVars(
            {
              color: sliderColorVars,
              space: sliderSpaceVars,
            },
            {
              color: {
                color: genericColorVars.condition.base.v2,
              },
              space: {
                margin: 'auto 0',
              },
            },
          ),
        },
      ]),
    ),
    max: style(
      applyThemeVars<SliderState>(sliderStateVars, [
        {
          vars: assignPartialVars(
            {
              color: sliderColorVars,
              space: sliderSpaceVars,
            },
            {
              color: {
                color: genericColorVars.condition.base.v2,
              },
              space: {
                margin: 'auto 0',
              },
            },
          ),
        },
      ]),
    ),
  },
  thumb: {
    container: style(
      applyThemeVars<SliderThumbState>(sliderThumbStateVars, [
        {
          vars: assignPartialVars(sliderSpaceVars, {
            width: defaultSizesVarValues.v05,
          }),
        },
      ]),
    ),
    thumb: style(
      applyThemeVars<SliderThumbState>(sliderThumbStateVars, [
        {
          vars: assignPartialVars(
            {
              color: sliderColorVars,
              space: sliderSpaceVars,
            },
            {
              color: {
                color: semanticColorVars.background.highlight.bold,
              },
              space: {
                height: defaultSizesVarValues.v05,
                width: defaultSizesVarValues.v05,
                borderRadius: defaultRadiusVarValues.round,
              },
            },
          ),
        },
        {
          query: { isHovered: true },
          vars: assignPartialVars(sliderColorVars, {
            boxShadow: `0px 0px 0 6px rgb(from ${semanticColorVars.background.highlight.bold} r g b / 0.25)`,
          }),
        },
      ]),
    ),
  },
  track: {
    container: style(
      applyThemeVars<SliderState>(sliderTrackStateVars, [
        {
          vars: assignPartialVars(
            {
              color: sliderColorVars,
              space: sliderSpaceVars,
            },
            {
              color: {
                color: semanticColorVars.background.surface.overlay,
              },
              space: {
                trackHeight: defaultSizesVarValues.v02,
                trackMargin: `${defaultSizesVarValues.v04} 0`,
              },
            },
          ),
        },
      ]),
    ),
  },
  input: {
    container: style(
      applyThemeVars<SliderState>(sliderStateVars, [
        {
          vars: assignPartialVars(sliderSpaceVars, {
            gap: defaultSizesVarValues.v03,
          }),
        },
      ]),
    ),
  },
};
