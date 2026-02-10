import type { LinkProps } from '@accelint/design-toolkit';

export type LinkVariant = Pick<
  LinkProps,
  'allowsVisited' | 'isVisited' | 'isDisabled'
>;

export const PROP_COMBOS: LinkVariant[] = [
  { allowsVisited: true, isVisited: true, isDisabled: true },
  { allowsVisited: true, isVisited: true, isDisabled: false },
  { allowsVisited: true, isVisited: false, isDisabled: true },
  { allowsVisited: true, isVisited: false, isDisabled: false },
  { allowsVisited: false, isVisited: true, isDisabled: true },
  { allowsVisited: false, isVisited: true, isDisabled: false },
  { allowsVisited: false, isVisited: false, isDisabled: true },
  { allowsVisited: false, isVisited: false, isDisabled: false },
];
