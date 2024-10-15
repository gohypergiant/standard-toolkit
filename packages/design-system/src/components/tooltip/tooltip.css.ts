import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers, radiusVars, surfaces, zIndexVars } from '../../styles';
import { containerQueries } from '../../utils';
import type {
  TooltipClassNames,
  TooltipState,
  TooltipTargetState,
} from './types';

export const tooltipContainers = {
  tooltip: createContainer(),
  target: createContainer(),
};

export const tooltipSpaceVars = createThemeContract({
  x: '',
  y: '',
});

export const tooltipStateVars = createThemeContract({
  containerPadding: '',
  crossOffset: '',
  offset: '',
  placement: '',
  isEntering: '',
  isExiting: '',
  isOpen: '',
});

export const tooltipTargetStateVars = createThemeContract({
  focusable: '',
  relative: '',
});

export const tooltipClassNames: TooltipClassNames = {
  tooltip: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: tooltipContainers.tooltip,
          display: 'block', // Need to override conflict with base theme style
          zIndex: `${zIndexVars.tooltip} !important`, // Need to override inline style set by React Aria
        },
      },
    }),
    tooltip: style([
      surfaces.overlay.proud,
      {
        '@layer': {
          [layers.components.l1]: {
            padding: `${fallbackVar(tooltipSpaceVars.y, '0')} ${fallbackVar(tooltipSpaceVars.x, '0')}`,
            borderRadius: radiusVars.md,
            textAlign: 'center',
            '@container': containerQueries<TooltipState>(
              tooltipStateVars,
              {
                query: { placement: 'top' },
                marginBottom: `calc(${tooltipStateVars.containerPadding} * 1px)`,
              },
              {
                query: { placement: 'right' },
                marginLeft: `calc(${tooltipStateVars.containerPadding} * 1px)`,
              },
              {
                query: { placement: 'bottom' },
                marginTop: `calc(${tooltipStateVars.containerPadding} * 1px)`,
              },
              {
                query: { placement: 'left' },
                marginRight: `calc(${tooltipStateVars.containerPadding} * 1px)`,
              },
            ),
          },
        },
      },
    ]),
  },

  target: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: tooltipContainers.target,
          display: 'contents',
        },
      },
    }),
    target: style({
      '@layer': {
        [layers.components.l1]: {
          width: 'fit-content',
          '::before': {
            content: '',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
          '@container': containerQueries<TooltipTargetState>(
            tooltipTargetStateVars,
            {
              query: { relative: 'self' },
              position: 'relative',
            },
          ),
        },
      },
    }),
  },
};
