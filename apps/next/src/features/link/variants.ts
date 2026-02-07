import type { LinkProps } from '@accelint/design-toolkit';

export type LinkVariant = Pick<LinkProps, 'allowsVisited' | 'isVisited'>;

export const PROP_COMBOS: LinkVariant[] = [
  { allowsVisited: true, isVisited: true },
  { allowsVisited: true, isVisited: false },
  { allowsVisited: false, isVisited: true },
  { allowsVisited: false, isVisited: false },
];
