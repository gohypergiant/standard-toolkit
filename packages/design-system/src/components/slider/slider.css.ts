import { createContainer, createThemeContract, style } from '@vanilla-extract/css';
import type { SliderClassNames } from './types';
import { genericColorVars, layers, semanticColorVars } from '../../styles';

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
          position: 'relative',
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
          position: 'relative',
          // todo: use vars from theme contract
          backgroundColor: semanticColorVars.background.surface.overlay,
          height: '2px',
        },
      },
    }),
    thumb: style({
      '@layer': {
        [layers.components.l1]: {
          position: 'absolute',
          left: '0',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          // todo: use vars from theme contract
          backgroundColor: semanticColorVars.background.highlight.bold,
        },
      },
    }),
    numberField: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'output',
          height: '24px',
          width: '100%',
        },
      },
    }),
  }
};