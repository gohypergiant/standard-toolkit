import {
  createContainer,
  createThemeContract,
  style,
} from '@vanilla-extract/css';
import type { SliderClassNames } from './types';
import { layers, typographyVars } from '../../styles';
import { containerQueries } from '@/utils';

const sliderContainers = {
  input: createContainer(),
};

export const sliderColorVars = createThemeContract({
  color: '',
  shadow: '',
  thumb: '',
  fontColor: '',
});

export const sliderSpaceVars = createThemeContract({
  gap: '',
  gridGap: '',
  height: '',
  width: '',
  borderRadius: '',
  trackHeight: '',
  trackMargin: '',
  margin: '',
});

export const sliderStateVars = createThemeContract({
  alignLabel: '',
  orientation: '',
  isDisabled: '',
  isFocused: '',
  isHovered: '',
});

export const sliderClassNames: SliderClassNames = {
  slider: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'grid',
          gridTemplateAreas: `'label input' 
          'track track'
          'min max'`,
          gridTemplateColumns: '1fr auto',
          '@container': containerQueries(sliderStateVars, {
            query: { alignLabel: 'left' },
            display: 'grid',
            gridTemplateAreas: `'label min track max input'`,
            gridTemplateColumns: 'auto auto 4fr auto auto',
            gap: sliderSpaceVars.gridGap,
            margin: 'auto 0',
          }),
        },
      },
    }),
    slider: style({
      '@layer': {
        [layers.components.l1]: {
          // position: 'relative',
          // color: sliderColorVars.color,
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
    track: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'track',
          background: sliderColorVars.color,
          height: sliderSpaceVars.trackHeight,
          margin: sliderSpaceVars.trackMargin,
          '@container': containerQueries(sliderStateVars, {
            query: { alignLabel: 'left' },
            margin: 'auto 0',
          }),
        },
      },
    }),
    bar: style({
      '@layer': {
        [layers.components.l1]: {
          backgroundColor: sliderColorVars.color,
          height: sliderSpaceVars.height,
        },
      },
    }),
    thumb: style({
      '@layer': {
        [layers.components.l1]: {
          width: sliderSpaceVars.width,
          height: sliderSpaceVars.height,
          borderRadius: sliderSpaceVars.borderRadius,
          backgroundColor: sliderColorVars.color,
          zIndex: 2,
          '@container': containerQueries(sliderStateVars, {
            query: { isHovered: true },
            boxShadow: sliderColorVars.shadow,
          }),
        },
      },
    }),
    input: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: sliderContainers.input,
          gridArea: 'input',
          display: 'flex',
          flexDirection: 'row',
          gap: sliderSpaceVars.gap,
        },
      },
    }),
    min: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'min',
          fontFamily: typographyVars.mono,
          color: sliderColorVars.color,
          '@container': containerQueries(sliderStateVars, {
            query: { alignLabel: 'left' },
            margin: sliderSpaceVars.margin,
          }),
        },
      },
    }),
    max: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'max',
          fontFamily: typographyVars.mono,
          marginLeft: 'auto',
          color: sliderColorVars.color,
          '@container': containerQueries(sliderStateVars, {
            query: { alignLabel: 'left' },
            margin: sliderSpaceVars.margin,
          }),
        },
      },
    }),
  },
};
