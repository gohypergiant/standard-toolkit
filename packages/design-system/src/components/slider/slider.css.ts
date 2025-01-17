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

import { createThemeContract, globalStyle, style } from '@vanilla-extract/css';
import type { SliderClassNames, SliderState } from './types';
import { layers, typographyVars } from '../../styles';
import { containerQueries } from '../../utils';

export const sliderColorVars = createThemeContract({
  color: '',
  background: '',
  boxShadow: '',
  thumb: {
    color: '',
  },
  track: {
    color: '',
  },
  bar: {
    color: '',
  },
});

export const sliderSpaceVars = createThemeContract({
  gap: '',
  margin: '',
  track: {
    minDimension: '', // width | height
    thickness: '', // cross-axis dimension
  },
  thumb: {
    height: '',
    width: '',
    borderRadius: '',
  },
  bar: {
    height: '',
    width: '',
  },
});

export const sliderStateVars = createThemeContract({
  alignLabel: '',
  orientation: '',
  isDisabled: '',
});

export const sliderThumbStateVars = createThemeContract({
  alignLabel: '',
  isDisabled: '',
  isDragging: '',
  isFocused: '',
  isFocusVisible: '',
  isHovered: '',
});

export const sliderTrackStateVars = createThemeContract({
  alignLabel: '',
  isDisabled: '',
  isHovered: '',
});

export const sliderClassNames: SliderClassNames = {
  slider: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'contents',
        },
      },
    }),
    slider: style({
      '@layer': {
        [layers.components.l1]: {
          width: 'fit-content',
          display: 'grid',
          gridTemplateAreas: `'label . io'
          'track track track'
          'min . max'`,
          gridTemplateColumns: 'auto 1fr auto',
          gap: sliderSpaceVars.gap,
          '@container': containerQueries<SliderState>(
            sliderStateVars,
            {
              query: { orientation: 'horizontal', alignLabel: 'inline' },
              gridTemplateAreas: `'label min track max io'`,
              gap: sliderSpaceVars.gap,
              alignItems: 'center',
            },
            {
              query: { orientation: 'vertical', alignLabel: 'stacked' },
              width: 'fit-content',
              gridTemplateAreas: `'label label label'
              'max track .'
              '. track .'
              'min track io'`,
              gridTemplateColumns: 'min-content min-content auto',
              gridTemplateRows: 'auto auto 1fr auto',
            },
            {
              query: { orientation: 'vertical', alignLabel: 'inline' },
              gridTemplateAreas: `'label label label'
              'max . .'
              'track . .'
              'min . .'
              'io io .'`,
              gap: sliderSpaceVars.gap,
            },
          ),
        },
      },
    }),
    label: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'label',
        },
      },
    }),
    tick: style({
      '@layer': {
        [layers.components.l1]: {
          fontFamily: typographyVars.mono,
          color: sliderColorVars.color,
          lineHeight: '12px',
        },
      },
    }),
    min: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'min',
          '@container': containerQueries<SliderState>(
            sliderStateVars,
            {
              query: { orientation: 'vertical', alignLabel: 'stacked' },
              alignSelf: 'end',
              justifySelf: 'end',
            },
            {
              query: { orientation: 'vertical', alignLabel: 'inline' },
              justifySelf: 'center',
            },
          ),
        },
      },
    }),
    max: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'max',
          justifySelf: 'end',
          '@container': containerQueries<SliderState>(sliderStateVars, {
            query: { orientation: 'vertical', alignLabel: 'inline' },
            justifySelf: 'center',
          }),
        },
      },
    }),
  },
  track: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'track',
          '@container': containerQueries<SliderState>(sliderStateVars, {
            query: {
              orientation: 'vertical',
              alignLabel: 'inline',
            },
            justifySelf: 'center',
          }),
        },
      },
    }),
    track: style({
      '@layer': {
        [layers.components.l1]: {
          position: 'relative',
          background: sliderColorVars.track.color,
          '@container': containerQueries<SliderState>(
            sliderStateVars,
            {
              query: { orientation: 'horizontal' },
              minWidth: sliderSpaceVars.track.minDimension,
              height: sliderSpaceVars.track.thickness,
            },
            {
              query: { orientation: 'vertical' },
              width: sliderSpaceVars.track.thickness,
              minHeight: sliderSpaceVars.track.minDimension,
            },
          ),
        },
      },
    }),
    bar: style({
      '@layer': {
        [layers.components.l1]: {
          background: sliderColorVars.bar.color,
          '@container': containerQueries<SliderState>(
            sliderStateVars,
            {
              query: { orientation: 'horizontal' },
              height: '100%',
            },
            {
              query: { orientation: 'vertical' },
              width: '100%',
            },
          ),
        },
      },
    }),
  },
  thumb: {
    container: style({
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      '@layer': {
        [layers.components.l1]: {
          '@container': containerQueries<SliderState>(
            sliderStateVars,
            {
              query: { orientation: 'horizontal' },
              top: '50%',
            },
            {
              query: { orientation: 'vertical' },
              left: '50%',
            },
          ),
        },
      },
    }),
    thumb: style({
      '@layer': {
        [layers.components.l1]: {
          width: sliderSpaceVars.thumb.width,
          height: sliderSpaceVars.thumb.height,
          borderRadius: sliderSpaceVars.thumb.borderRadius,
          backgroundColor: sliderColorVars.background,
          boxShadow: sliderColorVars.boxShadow,
        },
      },
    }),
  },
  group: {
    group: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'io',
        },
      },
    }),
  },
  output: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'io',
        },
      },
    }),
    output: style({}),
  },
};

// unable to target input to apply styles
// by default, input has a ~90px width
globalStyle(`.${sliderClassNames.thumb?.container} input`, {
  width: sliderSpaceVars.thumb.width,
});
