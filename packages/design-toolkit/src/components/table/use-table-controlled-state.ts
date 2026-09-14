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

'use client';
import 'client-only';
import { useControlledState } from 'react-stately/useControlledState';
import type { OnChangeFn } from '@tanstack/react-table';

/**
 * Adapter between the Table's controlled-state prop convention and the
 * TanStack table engine, for every Table-owned state slice.
 *
 * Each slice is exposed as the triple `x` / `defaultX` / `onXChange`:
 * - Uncontrolled by default; controlled exactly when `value !== undefined`.
 * - The returned setter accepts TanStack's `Updater<T>` (value or updater
 *   function) and resolves updaters internally, so `onChange` always receives
 *   the plain next value, never a function.
 * - `onChange` is not invoked when the resolved next value is reference-equal
 *   to the current value.
 * - Switching a slice between controlled and uncontrolled after mount is not
 *   supported (react-stately warns in non-production builds).
 *
 * The returned setter is typed as `OnChangeFn<T>` so it plugs straight into
 * `useTable({ state, onXChange })`.
 *
 * @template T - The state slice's value type.
 * @param value - Controlled value; the slice is controlled when not `undefined`.
 * @param defaultValue - Initial value for uncontrolled use. Pass a stable
 * reference (module-level constant) to avoid re-render churn.
 * @param onChange - Called with the plain resolved next value.
 * @returns A `[value, setValue]` tuple; `setValue` satisfies TanStack's
 * `OnChangeFn<T>`.
 *
 * @example
 * ```tsx
 * const [rowSelection, setRowSelection] = useTableControlledState(
 *   rowSelectionProp,
 *   defaultRowSelection,
 *   onRowSelectionChange,
 * );
 *
 * useTable({
 *   state: { rowSelection },
 *   onRowSelectionChange: setRowSelection,
 * });
 * ```
 */
export function useTableControlledState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, OnChangeFn<T>] {
  // react-stately's overloads take Exclude<T, undefined> to forbid undefined
  // as a state value. Table slices never use undefined (zero values such as
  // {} or [] instead), so the casts only restate that contract for a bare T.
  return useControlledState(
    value as Exclude<T, undefined> | undefined,
    defaultValue as Exclude<T, undefined>,
    onChange,
  );
}
