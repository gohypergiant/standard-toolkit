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
import { createContext } from 'react';
import { TreeStylesDefaults } from './styles';
import type { TreeContextValue, TreeItemContextValue } from './types';

/**
 * Context for Tree component
 */
export const TreeContext = createContext<TreeContextValue>({
  visibilityComputedKeys: new Set(),
  showRuleLines: true,
  showVisibility: false,
  variant: TreeStylesDefaults.variant,
  isStatic: true,
  onVisibilityChange: () => undefined,
});

/**
 * Context for TreeItem component
 */
export const TreeItemContext = createContext<TreeItemContextValue>({
  isVisible: true,
  isViewable: true,
  ancestors: [],
});
