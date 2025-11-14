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

import { createContext, useContext } from 'react';
import type { ContextValue } from 'react-aria-components';
import type { ProviderProps } from '@/lib/types';
import type { CoordinateFieldProps, CoordinateFieldState } from './types';

/**
 * Context for CoordinateField component props
 */
export const CoordinateFieldContext =
  createContext<ContextValue<CoordinateFieldProps, HTMLDivElement>>(null);

/**
 * Context for CoordinateField state
 * Allows child components (like CoordinateSegment) to access shared state
 */
export const CoordinateFieldStateContext =
  createContext<CoordinateFieldState | null>(null);

/**
 * Provider component for CoordinateField context
 * Wraps children with CoordinateFieldContext
 */
export function CoordinateFieldProvider({
  children,
  ...props
}: ProviderProps<CoordinateFieldProps>) {
  return (
    <CoordinateFieldContext.Provider value={props}>
      {children}
    </CoordinateFieldContext.Provider>
  );
}

/**
 * Provider component for CoordinateField state context
 * Wraps children with CoordinateFieldStateContext
 */
export function CoordinateFieldStateProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: CoordinateFieldState;
}) {
  return (
    <CoordinateFieldStateContext.Provider value={value}>
      {children}
    </CoordinateFieldStateContext.Provider>
  );
}

/**
 * Hook to access CoordinateField state context
 * Must be used within a CoordinateField component
 * @throws {Error} If used outside of CoordinateField
 * @returns {CoordinateFieldState} The coordinate field state
 */
export const useCoordinateFieldStateContext = () => {
  const context = useContext(CoordinateFieldStateContext);
  if (!context) {
    throw new Error(
      'useCoordinateFieldStateContext must be used within CoordinateField',
    );
  }
  return context;
};
