import { style } from '@vanilla-extract/css';
import { layers } from '../../styles';

export const root = style({
  '@layer': {
    [layers.styles]: {
      display: 'contents',
    },
  },
});
