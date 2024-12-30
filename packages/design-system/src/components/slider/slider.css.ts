import { createContainer, createThemeContract, layer, style } from '@vanilla-extract/css';
import { type SliderClassNames } from './types';
import { genericColorVars, layers, semanticColorVars, typographyVars } from '../../styles';
import { containerQueries } from '@/utils';

const sliderContainers = {
  track: createContainer(),
  input: createContainer(),
}

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
          gridTemplateAreas: `'label input' 
          'track track'
          'min max'`,
          gridTemplateColumns: '1fr auto',
          width: '400px', // 100% or constrain to max width?
          '@container': containerQueries(sliderStateVars, {
            query: { alignLabel: 'left' },
            display: 'grid',
            gridTemplateAreas: `'label min track max input'`,
            gridTemplateColumns: 'auto auto 4fr auto auto',
            gap: '8px',
          }),
        },
      }
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
          containerName: sliderContainers.track,
          gridArea: 'track',
          position: 'relative',
          // todo: use vars from theme contract
          backgroundColor: semanticColorVars.background.surface.overlay,
          height: '2px',
          margin: '8px 0',
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
          '@container': containerQueries(sliderStateVars, {
            query: { isHovered: true },
            // todo: ask about rgba values for preset colors
            boxShadow: `0px 0px 0 4px rgba(40, 245, 190, .2)`,
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
          gap: '4px',
        },
      },
    }),
    min: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'min',
          fontFamily: typographyVars.mono,
          color: genericColorVars.condition.base.v2,
        },
      },
    }),
    max: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'max',
          fontFamily: typographyVars.mono,
          marginLeft: 'auto',
          color: genericColorVars.condition.base.v2,
        },
      },
    }),
  }
};