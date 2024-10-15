import { globalStyle, style, type StyleRule } from '@vanilla-extract/css';
import { layers } from './layers.css';
import { typographyVars } from './theme.css';

export const families = {
  mono: style({ fontFamily: typographyVars.mono }),
  sans: style({ fontFamily: typographyVars.sans }),
  serif: style({ fontFamily: typographyVars.serif }),
};

type HeadingVariants = keyof typeof typographyVars.heading;
type Headings = Record<HeadingVariants, string>;

const HTML_HEADING_TAG_COUNT = 6;

export const headings = Array.from({
  length: HTML_HEADING_TAG_COUNT,
}).reduce<Headings>((acc, _, index) => {
  const variant = `v${index + 1}` as HeadingVariants;

  const rule: StyleRule = {
    '@layer': {
      [layers.styles]: {
        fontSize: typographyVars.heading[variant].size,
        fontWeight: typographyVars.heading[variant].weight,
        letterSpacing: typographyVars.heading[variant].spacing,
        lineHeight: typographyVars.heading[variant].height,
      },
    },
  };

  globalStyle(`h${index + 1}`, rule);

  acc[variant] = style(rule);

  return acc;
}, {} as Headings);

type BodyVariants = keyof typeof typographyVars.body;
type Bodies = Record<BodyVariants, string>;

export const bodies = (
  ['xs', 'sm', 'md', 'lg', 'xl'] satisfies BodyVariants[]
).reduce((acc, variant) => {
  acc[variant] = style({
    '@layer': {
      [layers.styles]: {
        fontSize: typographyVars.body[variant].size,
        fontWeight: typographyVars.body[variant].weight,
        letterSpacing: typographyVars.body[variant].spacing,
        lineHeight: typographyVars.body[variant].height,
      },
    },
  });

  return acc;
}, {} as Bodies);

type InputVariants = keyof typeof typographyVars.input;
type Inputs = Record<InputVariants, string>;

export const inputs = (['sm', 'lg'] satisfies InputVariants[]).reduce(
  (acc, variant) => {
    acc[variant] = style({
      '@layer': {
        [layers.styles]: {
          fontSize: typographyVars.input[variant].size,
          fontWeight: typographyVars.input[variant].weight,
          letterSpacing: typographyVars.input[variant].spacing,
          lineHeight: typographyVars.input[variant].height,
        },
      },
    });

    return acc;
  },
  {} as Inputs,
);

const inputRule: StyleRule = {
  '@layer': {
    [layers.styles]: {
      fontSize: typographyVars.input.lg.size,
      fontWeight: typographyVars.input.lg.weight,
      letterSpacing: typographyVars.input.lg.spacing,
      lineHeight: typographyVars.input.lg.height,
    },
  },
};

globalStyle('input', inputRule);

globalStyle('textarea', inputRule);

const labelRule: StyleRule = {
  '@layer': {
    [layers.styles]: {
      fontSize: typographyVars.label.size,
      fontWeight: typographyVars.label.weight,
      letterSpacing: typographyVars.label.spacing,
      lineHeight: typographyVars.label.height,
    },
  },
};

globalStyle('label', labelRule);

export const label = style(labelRule);
