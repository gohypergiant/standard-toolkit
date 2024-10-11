import { globalStyle } from '@vanilla-extract/css';
import { layers } from './layers.css';
import { spaceVars } from './theme.css';

globalStyle('h1, h2, h3, h4, h5, h6', {
  '@layer': {
    [layers.styles]: {
      marginBottom: spaceVars.heading,
    },
  },
});

globalStyle('p', {
  '@layer': {
    [layers.styles]: {
      marginBottom: spaceVars.paragraph,
    },
  },
});

globalStyle('ol, ul', {
  '@layer': {
    [layers.styles]: {
      marginBottom: spaceVars.list.group,
    },
  },
});

globalStyle('li', {
  '@layer': {
    [layers.styles]: {
      marginBottom: spaceVars.list.item,
    },
  },
});

globalStyle(':last-child', {
  '@layer': {
    [layers.styles]: {
      marginBottom: spaceVars.lastChild,
    },
  },
});
