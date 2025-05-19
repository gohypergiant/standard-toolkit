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
import { layers } from '../../styles/layers.css';
import { typographyVars } from '../../styles/theme.css';
import { containerQueries } from '../../utils/css';
import type { SliderClassNames, SliderState } from './types';

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
  layout: '',
  orientation: '',
  isDisabled: '',
});

export const sliderThumbStateVars = createThemeContract({
  layout: '',
  isDisabled: '',
  isDragging: '',
  isFocused: '',
  isFocusVisible: '',
  isHovered: '',
});

export const sliderTrackStateVars = createThemeContract({
  layout: '',
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
              query: { orientation: 'horizontal', layout: 'inline' },
              gridTemplateAreas: `'label min track max io'`,
              gridTemplateColumns: 'auto auto 1fr auto auto',
              gap: sliderSpaceVars.gap,
              alignItems: 'center',
            },
            {
              query: { orientation: 'vertical', layout: 'stacked' },
              width: 'fit-content',
              gridTemplateAreas: `'label label label'
              'max track .'
              '. track .'
              'min track io'`,
              gridTemplateColumns: 'min-content min-content auto',
              gridTemplateRows: 'auto auto 1fr auto',
            },
            {
              query: { orientation: 'vertical', layout: 'inline' },
              gridTemplateAreas: `'label label label'
              'max . .'
              'track . .'
              'min . .'
              'io io .'`,
              gap: sliderSpaceVars.gap,
              gridTemplateRows: 'auto auto 1fr auto auto',
            },
            {
              query: { isDisabled: true },
              cursor: 'not-allowed',
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
              query: { orientation: 'vertical', layout: 'stacked' },
              alignSelf: 'end',
              justifySelf: 'end',
            },
            {
              query: { orientation: 'vertical', layout: 'inline' },
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
            query: { orientation: 'vertical', layout: 'inline' },
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
              layout: 'inline',
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
          margin: `calc(${sliderSpaceVars.thumb.width} / 2)`,
          background: sliderColorVars.track.color,
          '::before': {
            content: '',
            position: 'absolute',
            background: sliderColorVars.track.color,
          },
          '::after': {
            content: '',
            position: 'absolute',
            background: sliderColorVars.track.color,
          },
          '@container': containerQueries<SliderState>(
            sliderStateVars,
            {
              query: { orientation: 'horizontal' },
              minWidth: sliderSpaceVars.track.minDimension,
              height: sliderSpaceVars.track.thickness,
              '::before': {
                width: `calc(${sliderSpaceVars.thumb.width} / 2)`,
                top: 0,
                bottom: 0,
                right: '100%',
              },
              '::after': {
                width: `calc(${sliderSpaceVars.thumb.width} / 2)`,
                top: 0,
                bottom: 0,
                left: '100%',
              },
            },
            {
              query: { orientation: 'vertical' },
              width: sliderSpaceVars.track.thickness,
              minHeight: sliderSpaceVars.track.minDimension,
              height: `calc(100% - 2 * ${sliderSpaceVars.thumb.width})`,
              '::before': {
                height: `calc(${sliderSpaceVars.thumb.width} / 2)`,
                left: 0,
                right: 0,
                bottom: '100%',
              },
              '::after': {
                height: `calc(${sliderSpaceVars.thumb.width} / 2)`,
                left: 0,
                right: 0,
                top: '100%',
              },
            },
          ),
        },
      },
    }),
    bar: style({
      '@layer': {
        [layers.components.l1]: {
          position: 'relative',
          background: sliderColorVars.bar.color,
          '::before': {
            content: '',
            position: 'absolute',
            background: sliderColorVars.bar.color,
          },
          '::after': {
            content: '',
            position: 'absolute',
            background: sliderColorVars.bar.color,
          },
          '@container': containerQueries<SliderState>(
            sliderStateVars,
            {
              query: { orientation: 'horizontal' },
              height: '100%',
              '::before': {
                width: `calc(${sliderSpaceVars.thumb.width} / 2)`,
                top: 0,
                bottom: 0,
                right: '100%',
              },
            },
            {
              query: { orientation: 'vertical' },
              width: '100%',
              '::before': {
                height: `calc(${sliderSpaceVars.thumb.width} / 2)`,
                left: 0,
                right: 0,
                bottom: '100%',
              },
              '::after': {
                height: `calc(${sliderSpaceVars.thumb.width} / 2)`,
                left: 0,
                right: 0,
                top: '100%',
                zIndex: 1,
              },
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
      zIndex: 1,
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
  numberField: {
    container: style({
      '@layer': {
        [layers.components.l2]: {
          gridArea: 'io',
        },
      },
    }),
  },
  group: {
    group: style({
      '@layer': {
        [layers.components.l2]: {
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
    output: style({
      display: 'flex',
    }),
  },
};

// unable to target input to apply styles
// by default, input has a ~90px width
globalStyle(`.${sliderClassNames.thumb?.container} input`, {
  width: sliderSpaceVars.thumb.width,
});
