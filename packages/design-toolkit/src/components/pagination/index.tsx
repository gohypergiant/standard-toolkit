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
import { useControlledState } from '@react-stately/utils';
import { PaginationContext } from './context';
import { PaginationNext } from './next';
import { PaginationPages } from './pages';
import { PaginationPrev } from './prev';
import { PaginationStyles } from './styles';
import type { PaginationProps } from './types';

const { container } = PaginationStyles();

/**
 *
 * Pagination - A lightweight implementation for page navigation.
 *
 * @example
 * <Pagination currentPage={1} pageCount={5} onChange={handleOnChange} />
 *
 * @param currentPage - represents currently selected page number
 * @param pageCount - total number of pages
 * @param onChange - (page: number) => void, handler for button press events
 * @param classNames - group of styling applied to components
 *    * container - <nav> container for component
 *    * controls - navigation controls, previous/next
 *    * pages - buttons for page numbers
 */
export function Pagination({
  children,
  classNames,
  defaultValue = 1,
  total = 0,
  value,
  isLoading,
  onChange,
  ...rest
}: PaginationProps) {
  const [page, setPage] = useControlledState(value, defaultValue, onChange);

  return (
    <PaginationContext.Provider value={{ page, total, isLoading, setPage }}>
      <nav
        {...rest}
        className={container({ className: classNames?.container })}
        aria-label={`Page ${page} of ${total}`}
      >
        {children || (
          <>
            <PaginationPrev className={classNames?.prev} />
            <PaginationPages className={classNames?.pages} />
            <PaginationNext className={classNames?.next} />
          </>
        )}
      </nav>
    </PaginationContext.Provider>
  );
}
