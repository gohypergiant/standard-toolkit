import { layer } from '@vanilla-extract/css';
import type { IntRange, Sum } from 'type-fest';

const LEVELS = 5;

type Range = IntRange<1, Sum<typeof LEVELS, 1>>;
type Levels = `l${Range}`;

const levels: Levels[] = Array.from(
  { length: LEVELS },
  (_, i) => `l${i + 1}` as Levels,
);

/**
 * Order represents hierarchy, lowest to highest
 *
 * Levels allow for increasing layers of specificity
 * l1: Most common, non-conflicting, order is irrelevant
 * l2: Specialized / feature specific (overrides l1)
 * l3: One off / unique (overrides l1 & l2)
 * ...and so on...additional levels added in case of need for higher specificity
 */

// Browser overrides to base elements
const reset = layer();
// Parent for all of design system
const framework = layer('framework');
// Parent for variables levels
const variables = layer({ parent: framework }, 'variables');

const varsLevels = levels.reduce(
  (acc, level) => {
    acc[level] = layer({ parent: variables }, `variables.${level}`);

    return acc;
  },
  {} as Record<Levels, string>,
);

// Global styles, ex: typography
const styles = layer({ parent: framework }, 'styles');
// Parent for components levels
const components = layer({ parent: framework }, 'components');

const componentsLevels = levels.reduce(
  (acc, level) => {
    acc[level] = layer({ parent: components }, `components.${level}`);

    return acc;
  },
  {} as Record<Levels, string>,
);

// Parent for app specific overrides
const overrides = layer('overrides');

const overridesLevels = levels.reduce(
  (acc, level) => {
    acc[level] = layer({ parent: overrides }, `overrides.${level}`);

    return acc;
  },
  {} as Record<Levels, string>,
);

/**
 * Be aware that using parent layers overrides their children
 *
 * Example: "framework" overrides "components"
 *
 * Because of this, it is recommended to never directly use the
 * parent layers directly, only their children, which is why we
 * don't export them
 */

export const layers = {
  reset,
  variables: varsLevels,
  styles,
  components: componentsLevels,
  overrides: overridesLevels,
};
