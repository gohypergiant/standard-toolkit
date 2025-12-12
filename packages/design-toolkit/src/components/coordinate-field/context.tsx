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
 * CoordinateField Context Architecture
 *
 * This file defines two separate contexts following the React Aria component pattern:
 *
 * 1. CoordinateFieldContext (Props Context):
 *    - Contains user-provided props for the component
 *    - Used for React Aria's context-based prop merging
 *    - Part of the public composition API
 *
 * 2. CoordinateFieldStateContext (State Context):
 *    - Contains derived/computed runtime state
 *    - Used to share state with child components (e.g., CoordinateSegment)
 *    - Primarily for internal use

 * Separation keeps the public API (props) distinct from internal
 * implementation details (state), improving maintainability and composition.
 */

/**
 * Props Context for CoordinateField component.
 *
 * Contains user-provided props (label, format, size, value, onChange, etc.)
 * and is used by React Aria's useContextProps hook for context-based prop merging.
 * This enables parent components to provide default props to nested CoordinateField
 * components, supporting composition patterns.
 *
 * Part of the public API - external consumers can use this for component composition.
 *
 * @see CoordinateFieldStateContext for internal runtime state
 */
export const CoordinateFieldContext =
  createContext<ContextValue<CoordinateFieldProps, HTMLDivElement>>(null);

/**
 * State Context for CoordinateField component.
 *
 * Contains derived/computed runtime state (segmentValues, currentValue,
 * validationErrors, registerTimeout, etc.) that is shared with child components
 * like CoordinateSegment. This avoids prop drilling for deeply nested children.
 *
 * This follows the React Aria pattern of separating props context (public API)
 * from state context (internal implementation). While exported for composition
 * scenarios and testing, this is primarily for internal use.
 *
 * @see CoordinateFieldContext for user-provided props
 * @example
 * // Used internally by child components
 * const state = useCoordinateFieldStateContext();
 * const { segmentValues, isDisabled, registerTimeout } = state;
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
