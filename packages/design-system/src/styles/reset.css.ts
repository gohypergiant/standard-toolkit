import { globalStyle } from '@vanilla-extract/css';
import { layers } from './layers.css';
import { focusOutlineStyle, typographyVars } from './theme.css';

globalStyle('*', {
  '@layer': {
    [layers.reset]: {
      margin: 0,
    },
  },
});

globalStyle('*, *::before, *::after', {
  '@layer': {
    [layers.reset]: {
      boxSizing: 'border-box',
    },
  },
});

globalStyle(':focus-visible', {
  '@layer': {
    [layers.reset]: focusOutlineStyle,
  },
});

globalStyle('body', {
  '@layer': {
    [layers.reset]: {
      WebkitFontSmoothing: 'antialiased',
      fontFamily: typographyVars.sans,
    },
  },
});

globalStyle('img, picture, video, canvas, svg', {
  '@layer': {
    [layers.reset]: {
      display: 'block',
    },
  },
});

globalStyle('input, button, textarea, select', {
  '@layer': {
    [layers.reset]: {
      font: 'inherit',
      letterSpacing: 'inherit',
    },
  },
});

globalStyle('h1, h2, h3, h4, h5, h6, p', {
  '@layer': {
    [layers.reset]: {
      overflowWrap: 'break-word',
    },
  },
});

globalStyle('code', {
  '@layer': {
    [layers.reset]: {
      fontFamily: typographyVars.mono,
    },
  },
});
