import { createContainer, createThemeContract, style } from '@vanilla-extract/css';
import type { SliderClassNames } from './types';
import { layers } from '../../styles';


export const sliderContainer = createContainer();

export const sliderColorVars = createThemeContract({
  color: '',
  track: '',
  thumb: '',
});

export const sliderSpaceVars = createThemeContract({
  gap: '',
});

export const sliderStateVars = createThemeContract({
  alignLabel: '',
  isDisabled: '',
  isFocused: '',
  isHovered: '',
});

export const sliderClassNames: SliderClassNames = {
  // group: {
  //   container: style({
  //     '@layer': {
  //       [layers.components.l1]: {
  //         display: 'grid',
  //         gridTemplateAreas: `'label output' 
  //                             'track track'`,
  //         gridTemplateColumns: '1fr auto',
  //         color: sliderColorVars.color,
  //         width: '320px',
  //       },
  //     }
  //   }),
  // },
  slider: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'grid',
          gridTemplateAreas: `'label output' 
                              'track track'`,
          gridTemplateColumns: '1fr auto',
          width: '320px',
        },
      },
    }),
    slider: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'track',
          position: 'relative',
          color: sliderColorVars.color,
            '&:before': {
              content: '',
              display: 'block',
              position: 'absolute',
              background: 'magenta'
            }
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
  }
};