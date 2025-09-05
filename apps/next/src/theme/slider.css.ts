/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  radiusVars,
  type SliderState,
  type SliderThumbState,
  semanticColorVars,
  sizeVars,
  sliderColorVars,
  sliderSpaceVars,
  sliderStateVars,
  sliderThumbStateVars,
  type ThemeContext,
} from '@accelint/design-system/vanilla';
import { style } from '@vanilla-extract/css';

export const Slider: ThemeContext['Slider'] = {
  slider: {
    slider: style(
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
                gap: sizeVars.v04,
                track: {
                  minDimension: '200px',
                  thickness: sizeVars.v02,
                },
                thumb: {
                  height: sizeVars.v05,
                  width: sizeVars.v05,
                  borderRadius: radiusVars.round,
                },
              },
            },
          ),
        },
      ]),
    ),
    min: style(
      applyThemeVars<SliderState>(sliderStateVars, [
        {
          vars: assignPartialVars(sliderColorVars, {
            color: genericColorVars.condition.base.v2,
          }),
        },
      ]),
    ),
    max: style(
      applyThemeVars<SliderState>(sliderStateVars, [
        {
          vars: assignPartialVars(sliderColorVars, {
            color: genericColorVars.condition.base.v2,
          }),
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
          vars: assignPartialVars(sliderSpaceVars, {}),
        },
      ]),
    ),
    track: style(
      applyThemeVars<SliderState>(sliderStateVars, [
        {
          vars: assignPartialVars(sliderColorVars, {
            track: {
              color: semanticColorVars.background.surface.overlay,
            },
          }),
        },
      ]),
    ),
  },
};
