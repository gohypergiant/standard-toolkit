import { style } from '@vanilla-extract/css';
import {
  type SliderState,
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
      applyThemeVars<SliderState>(sliderThumbStateVars, [
        {
          vars: assignPartialVars(
            {
              color: sliderColorVars,
              space: sliderSpaceVars,
            },
            {
              color: {
                color: semanticColorVars.background.highlight.bold,
                shadow: `0px 0px 0 4px rgb(from ${semanticColorVars.background.highlight.bold} r g b / 0.2)`,
              },
              space: {
                height: defaultSizesVarValues.v05,
                width: defaultSizesVarValues.v05,
                borderRadius: defaultRadiusVarValues.round,
              },
            },
          ),
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
