/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import type { ListProps } from '@accelint/design-toolkit/components/list/types';
import type { ComponentVariantConfig } from '~/visual-regression/vitest';

export type ListScenarioProps = Pick<
  ListProps<object>,
  'variant' | 'selectionMode' | 'selectedKeys'
>;

export const LIST_VARIANTS: ComponentVariantConfig<ListScenarioProps>[] = [
  { id: 'cozy-none', name: 'cozy / none', props: { variant: 'cozy' } },
  {
    id: 'cozy-single',
    name: 'cozy / single',
    props: {
      variant: 'cozy',
      selectionMode: 'single',
      selectedKeys: new Set(['item-1']),
    },
  },
  {
    id: 'cozy-multiple',
    name: 'cozy / multiple',
    props: {
      variant: 'cozy',
      selectionMode: 'multiple',
      selectedKeys: new Set(['item-1', 'item-3']),
    },
  },
  {
    id: 'compact-none',
    name: 'compact / none',
    props: { variant: 'compact' },
  },
  {
    id: 'compact-single',
    name: 'compact / single',
    props: {
      variant: 'compact',
      selectionMode: 'single',
      selectedKeys: new Set(['item-1']),
    },
  },
  {
    id: 'compact-multiple',
    name: 'compact / multiple',
    props: {
      variant: 'compact',
      selectionMode: 'multiple',
      selectedKeys: new Set(['item-1', 'item-3']),
    },
  },
];
