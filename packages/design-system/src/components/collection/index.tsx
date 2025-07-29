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

import { type Context, useContext } from 'react';
import { useCollectionRender } from '../../hooks/use-collection-render';
import { MergeProvider } from '../merge-provider';
import type { Collection, Node } from '@react-types/shared';
import type { CollectionRenderer } from 'react-aria-components';
import type { MergeProviderProps } from '../merge-provider/types';

/**
 * Replace the default collection renderer to allow for injection of
 * context props for multiple composed components. Also enables use of
 * Section as wrapper of list items at the top level as a styleable
 * element within the RAC container
 */
export function createCollectionRenderer<
  C extends { readonly collection: Collection<Node<unknown>> },
  V extends MergeProviderProps['values'],
>(context: Context<C>, values: V): CollectionRenderer {
  return {
    // biome-ignore lint/style/useNamingConvention: intentional
    CollectionRoot: ({ renderDropIndicator }) => (
      <MergeProvider values={values}>
        {useCollectionRender(
          useContext(context)?.collection,
          null,
          renderDropIndicator,
        )}
      </MergeProvider>
    ),
    // biome-ignore lint/style/useNamingConvention: intentional
    CollectionBranch: ({ collection, parent, renderDropIndicator }) => (
      <MergeProvider values={values}>
        {useCollectionRender(collection, parent, renderDropIndicator)}
      </MergeProvider>
    ),
  };
}
