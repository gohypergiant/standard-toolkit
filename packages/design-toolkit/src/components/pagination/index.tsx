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
import { clsx } from '@accelint/design-foundation/lib/utils';
import { useControlledState } from '@react-stately/utils';
import { PaginationContext } from './context';
import { PaginationNext } from './next';
import { PaginationPages } from './pages';
import { PaginationPrev } from './prev';
import styles from './styles.module.css';
import type { PaginationProps } from './types';

/**
 * Pagination - Lightweight page navigation with prev/next controls
 *
 * Displays up to 5 page numbers at a time, automatically adjusting
 * the visible range as the user navigates.
 *
 * @example
 * <Pagination value={1} total={10} onChange={setPage} />
 *
 * @param value - Current page number (1-indexed)
 * @param total - Total number of pages
 * @param onChange - Handler called when page changes
 * @param classNames - Custom class names for styling:
 *   - container: nav container
 *   - prev: previous button
 *   - pages: page number buttons
 *   - next: next button
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
        className={clsx(styles.container, classNames?.container)}
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
