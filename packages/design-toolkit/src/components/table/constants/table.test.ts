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

import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it } from 'vitest';
import { TableContext } from '../context';
import { DEFAULT_TABLE_VARIANT } from './table';

describe('DEFAULT_TABLE_VARIANT', () => {
  it('should be cozy', () => {
    expect(DEFAULT_TABLE_VARIANT).toBe('cozy');
  });

  it('should be the variant of the default TableContext value', () => {
    const { result } = renderHook(() => useContext(TableContext));

    expect(result.current.variant).toBe('cozy');
    expect(result.current.variant).toBe(DEFAULT_TABLE_VARIANT);
  });
});
