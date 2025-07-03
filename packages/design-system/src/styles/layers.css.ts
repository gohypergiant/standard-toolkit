/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { globalLayer } from '@vanilla-extract/css';
import type { IntRange, Sum } from 'type-fest';

const LEVELS = 5;
const LAYER_NAMESPACE = 'old_ds_';

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
const reset = globalLayer(`${LAYER_NAMESPACE}reset`);
// Parent for all of design system
const framework = globalLayer(`${LAYER_NAMESPACE}framework`);
// Parent for variables levels
const variables = globalLayer(
  { parent: framework },
  `${LAYER_NAMESPACE}variables`,
);

const varsLevels = levels.reduce(
  (acc, level) => {
    acc[level] = globalLayer(
      { parent: variables },
      `${LAYER_NAMESPACE}variables.${level}`,
    );

    return acc;
  },
  {} as Record<Levels, string>,
);

// Global styles, ex: typography
const styles = globalLayer({ parent: framework }, `${LAYER_NAMESPACE}styles`);
// Parent for components levels
const components = globalLayer(
  { parent: framework },
  `${LAYER_NAMESPACE}components`,
);

const componentsLevels = levels.reduce(
  (acc, level) => {
    acc[level] = globalLayer(
      { parent: components },
      `${LAYER_NAMESPACE}components.${level}`,
    );

    return acc;
  },
  {} as Record<Levels, string>,
);

// Parent for app specific overrides
const overrides = globalLayer(`${LAYER_NAMESPACE}overrides`);

const overridesLevels = levels.reduce(
  (acc, level) => {
    acc[level] = globalLayer(
      { parent: overrides },
      `${LAYER_NAMESPACE}overrides.${level}`,
    );

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
