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

import { useContext } from 'react';
import { MapModeContext } from './index';
import type { MapModeContextValue } from './index';

/**
 * Hook to access the map mode context.
 * Must be used within a MapModeProvider.
 *
 * @returns The current map mode and requestModeChange function
 * @throws Error if used outside of MapModeProvider
 *
 * @example
 * ```tsx
 * function MyLayer() {
 *   const { mode, requestModeChange } = useMapMode();
 *
 *   const handleClick = () => {
 *     requestModeChange('editing', 'my-layer-uuid');
 *   };
 *
 *   return <div>Current mode: {mode}</div>;
 * }
 * ```
 */
export function useMapMode(): MapModeContextValue {
  const context = useContext(MapModeContext);

  if (!context) {
    throw new Error('useMapMode must be used within a MapModeProvider');
  }

  return context;
}
