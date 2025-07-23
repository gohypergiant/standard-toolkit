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

import { ChevronLeft, ChevronRight } from '@accelint/icons';
import { Input as AriaInput } from 'react-aria-components';
import { Button } from '../button';
import { PaginationStyles } from './styles';
import type { PaginationProps } from './types';
import { pagination } from './utils';

const {
  wrapper,
  pageToggleButton,
  pageInput,
  pageInputWrapper,
  pageEllipsis,
  pageValueButton,
} = PaginationStyles();

export function Pagination({
  onPreviousPage,
  isPreviousPageDisabled,
  onNextPage,
  isNextPageDisabled,
  pageCount,
  pageIndex,
  setPageIndex,
  ...props
}: PaginationProps) {
  return (
    <div className={wrapper()} {...props}>
      {/* Previous Page Button */}
      <Button
        variant='icon'
        onPress={onPreviousPage}
        isDisabled={isPreviousPageDisabled}
        className={pageToggleButton()}
      >
        <ChevronLeft />
      </Button>

      {/* Page Buttons */}
      {pagination(pageIndex + 1, pageCount).map((page) => {
        if (page === 'ellipsis') {
          return (
            <span key={page} className={pageEllipsis()}>
              ...
            </span>
          );
        }

        return (
          <Button
            key={page}
            className={pageValueButton({
              variant: pageIndex + 1 === page ? 'selected' : 'default',
            })}
            onPress={() => setPageIndex(page - 1)}
            isDisabled={pageIndex + 1 === page}
            data-selected={pageIndex + 1 === page}
            type='button'
            variant='flat'
          >
            {page}
          </Button>
        );
      })}

      {/* Next Page Button */}
      <Button
        variant='icon'
        onPress={onNextPage}
        isDisabled={isNextPageDisabled}
        className={pageToggleButton()}
      >
        <ChevronRight />
      </Button>

      {/* Page Input */}
      <span className={pageInputWrapper()}>
        Page{' '}
        <AriaInput
          type='number'
          min='1'
          max={pageCount}
          value={(pageIndex + 1).toString()}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            setPageIndex(page);
          }}
          className={pageInput()}
        />
      </span>
    </div>
  );
}
