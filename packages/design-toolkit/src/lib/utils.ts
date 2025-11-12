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

import type { ForwardedRef } from 'react';
import type { ContextValue } from 'react-aria-components';

// Types copied from RAC due to not being exported
type WithRef<T, E> = T & {
  ref?: ForwardedRef<E>;
};

interface SlottedValue<T> {
  slots?: Record<string | symbol, T>;
}

/**
 * A helper to narrow the type of Context Value
 */
export function isSlottedContextValue<T, E>(
  context: ContextValue<T, E>,
): context is SlottedValue<WithRef<T, E>> {
  return !!context && 'slots' in context;
}
