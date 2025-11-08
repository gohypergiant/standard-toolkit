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
'use client';

import 'client-only';
import { useContext } from 'react';
import {
  TreeItem as AriaTreeItem,
  composeRenderProps,
} from 'react-aria-components';
import { TreeContext, TreeItemContext } from './context';
import { TreeStyles } from './styles';
import type { TreeItemProps } from './types';

const { item } = TreeStyles();

/**
 * TreeItem - Individual node in a tree
 *
 * Represents a single item in the tree structure
 */
export function TreeItem({ className, id, ...rest }: TreeItemProps) {
  const { visibilityComputedKeys, visibleKeys, isStatic } =
    useContext(TreeContext);
  const { ancestors } = useContext(TreeItemContext);
  const isViewable =
    visibilityComputedKeys?.has(id) ||
    (isStatic && ancestors.every((key) => visibleKeys?.has(key)));
  const isVisible = visibleKeys?.has(id);

  return (
    <TreeItemContext.Provider
      value={{
        isVisible,
        isViewable,
        ancestors: [...ancestors, id],
      }}
    >
      <AriaTreeItem
        {...rest}
        id={id}
        className={composeRenderProps(className, (className) =>
          item({ className }),
        )}
        data-viewable={isViewable || null}
        data-visible={isVisible || null}
      />
    </TreeItemContext.Provider>
  );
}
