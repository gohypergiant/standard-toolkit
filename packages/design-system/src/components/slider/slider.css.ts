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
    margin: '',
    height: '',
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

export const sliderBarStateVars = createThemeContract({});

export const sliderClassNames: SliderClassNames = {
  slider: {
    slider: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'grid',
          gridTemplateAreas: `'label input' 
          'track track'
          'min max'`,
          gridTemplateColumns: '1fr auto',
          '@container': containerQueries<SliderState>(
            sliderStateVars,
            {
              query: { alignLabel: 'inline' },
              gridTemplateAreas: `'label min track max input'`,
              gridTemplateColumns: 'auto auto 1fr auto auto',
              gap: sliderSpaceVars.gap,
            },
            {
              query: { orientation: 'vertical' },
              gridTemplateAreas: `'label track max'
            'input track .'
            '. track min'`,
              gap: sliderSpaceVars.gap,
              gridTemplateRows: '1fr 1fr 3fr',
              height: '100%',
              maxWidth: '150px',
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
    min: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'min',
          fontFamily: typographyVars.mono,
          color: sliderColorVars.color,
          lineHeight: '12px',
          '@container': containerQueries<SliderState>(
            sliderStateVars,
            {
              query: { alignLabel: 'inline' },
              margin: sliderSpaceVars.margin,
            },
            {
              query: { orientation: 'vertical' },
              marginTop: 'auto',
            },
          ),
        },
      },
    }),
    max: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'max',
          fontFamily: typographyVars.mono,
          marginLeft: 'auto',
          lineHeight: '12px',
          color: sliderColorVars.color,
          '@container': containerQueries(sliderStateVars, {
            query: { alignLabel: 'inline' },
            margin: sliderSpaceVars.margin,
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
        },
      },
    }),
    track: style({
      background: sliderColorVars.track.color,
      height: sliderSpaceVars.track.height,
      margin: sliderSpaceVars.track.margin,
      right: 'auto',
      '@container': containerQueries<SliderState>(
        sliderStateVars,
        {
          query: { alignLabel: 'inline' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        },
        {
          query: { orientation: 'vertical' },
          height: '100%',
          width: sliderSpaceVars.track.height,
          margin: '0',
        },
      ),
    }),
  },
  thumb: {
    container: style({}),
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
  bar: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          '@container': containerQueries<SliderState>(sliderStateVars, {
            query: { orientation: 'vertical' },
            height: '100%',
          }),
        },
      },
    }),
    bar: style({
      '@layer': {
        [layers.components.l1]: {
          height: sliderSpaceVars.bar.height,
          backgroundColor: sliderColorVars.bar.color,
          '@container': containerQueries<SliderState>(sliderStateVars, {
            query: { orientation: 'vertical' },
            width: sliderSpaceVars.bar.height,
          }),
        },
      },
    }),
  },
  group: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'input',
        },
      },
    }),
  },
};

// unable to target input to apply styles
// by default, input has a ~90px width
globalStyle(`.${sliderClassNames.thumb?.container} input`, {
  width: sliderSpaceVars.thumb.width,
});
