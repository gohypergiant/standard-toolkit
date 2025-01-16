import { style } from '@vanilla-extract/css';
import {
  type SliderState,
  type SliderThumbState,
  applyThemeVars,
  assignPartialVars,
  sizeVars,
  genericColorVars,
  semanticColorVars,
  sliderColorVars,
  sliderSpaceVars,
  sliderStateVars,
  sliderThumbStateVars,
  type ThemeContext,
  radiusVars,
} from '../../src';

export const Slider: ThemeContext['Slider'] = {
  slider: {
    slider: style(
      applyThemeVars<SliderState>(sliderStateVars, [
        {
          vars: assignPartialVars(sliderSpaceVars, {
            gap: sizeVars.v04,
            thumb: {
              height: sizeVars.v05,
              width: sizeVars.v05,
              borderRadius: radiusVars.round,
            },
            track: {
              height: sizeVars.v02,
            },
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
    thumb: style(
      applyThemeVars<SliderThumbState>(sliderThumbStateVars, [
        {
          vars: assignPartialVars(sliderColorVars, {
            background: semanticColorVars.background.highlight.bold,
          }),
        },
        {
          query: { isHovered: true },
          vars: assignPartialVars(sliderColorVars, {
            boxShadow: `0 0 0 6px rgb(from ${semanticColorVars.background.highlight.bold} r g b / 0.25)`,
          }),
        },
      ]),
    ),
  },
  track: {
    container: style(
      applyThemeVars<SliderState>(sliderStateVars, [
        {
          vars: assignPartialVars(sliderSpaceVars, {
          }),
        },
      ]),
    ),
    track: style(
      applyThemeVars<SliderState>(sliderStateVars, [
        {
          vars: assignPartialVars(
            {
              color: sliderColorVars,
              space: sliderSpaceVars,
            },
            {
              color: {
                track: {
                  color: semanticColorVars.background.surface.overlay,
                },
              },
              space: {
                track: {
                  height: sizeVars.v02,
                  margin: `${sizeVars.v04} 0`,
                },
              },
            },
          ),
        },
      ]),
    ),
  },
  bar: {
    container: style(
      applyThemeVars<SliderState>(sliderStateVars, [
        {
          vars: assignPartialVars(
            { color: sliderColorVars, space: sliderSpaceVars },
            {
              color: {
                bar: {
                  color: semanticColorVars.background.highlight.bold,
                },
              },
              space: {
                bar: {
                  height: sizeVars.v02,
                },
              },
            },
          ),
        },
        {
          query: { orientation: 'vertical' },
          vars: assignPartialVars(sliderSpaceVars, {
            bar: {
              width: '2px',
            },
          }),
        },
      ]),
    ),
  },
};
