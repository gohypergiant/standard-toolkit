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

import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Pagination } from './index';
import type { BasePaginationProps } from './types';

function setup({ currentPage, pages }: Partial<BasePaginationProps> = {}) {
  return (
    <Pagination.Provider value={{ currentPage, pages }}>
      <Pagination>
        <Pagination.Previous />
        <Pagination.NumberContainer />
        <Pagination.Next />
      </Pagination>
    </Pagination.Provider>
  );
}

describe('Pagination', () => {
  it('should render', () => {
    setup({ currentPage: 1, pages: 5 });
    // What do we want to scan for here
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
