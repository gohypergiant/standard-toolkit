// __private-exports
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

import { createContext } from 'react';
import type { UniqueId } from '@accelint/core/utility/uuid';
import type { DockviewApi } from 'dockview-react';

export type FloatingCardContextValue = {
  cards: Record<UniqueId, HTMLDivElement>;
  addRef: (id: UniqueId, ref: HTMLDivElement | null) => void;
  removeRef: (view: UniqueId) => void;
  closeCard: (id: UniqueId) => void;
  api: DockviewApi | null;
};

export const FloatingCardContext = createContext<FloatingCardContextValue>({
  cards: {},
  addRef: () => undefined,
  removeRef: () => undefined,
  closeCard: () => undefined,
  api: null,
});
