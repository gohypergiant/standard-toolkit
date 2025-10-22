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

import ChevronLeft from '@accelint/icons/chevron-left';
import ChevronRight from '@accelint/icons/chevron-right';
import 'client-only';
import { range } from 'radashi';
import { createContext, useContext } from 'react';
import { Button, ToggleButton } from '../button';
import { Icon } from '../icon';
import { PaginationStyles } from './styles';
import type { ProviderProps } from 'react';
import type {
  BasePaginationProps,
  PaginationNavProps,
  PageNumberContainerProps as PaginationNumberContainerProps,
  PaginationPageNumberProps,
  PaginationRange,
} from './types';

const { container, button } = PaginationStyles();
const DEFAULT_MIN_RANGE = 1;
const DEFAULT_MAX_RANGE = 5;

/**
 * Return min max range for visible pages. As per our design, we limit
 * the range of numbers to a spread of 5 maximum, getting the lower and upper bounds.
 *
 * @param pageCount - total page count
 * @param currentPage - current page
 * @returns - Range of 1 to 5 numbers.
 */
export function getPaginationRange(
  pageCount: number,
  currentPage: number,
): PaginationRange {
  if (
    !(pageCount && currentPage) ||
    currentPage > pageCount ||
    pageCount < 1 ||
    currentPage < 1
  ) {
    return { minRange: 0, maxRange: 0 };
  }

  // Below max display.
  if (pageCount < 5) {
    return {
      minRange: 1,
      maxRange: pageCount,
    };
  }

  // Middle.
  if (currentPage >= 3 && currentPage < pageCount - 2) {
    return {
      minRange: currentPage - 2,
      maxRange: currentPage + 2,
    };
  }

  // End of page count.
  if (currentPage > pageCount - 3) {
    return {
      minRange: pageCount - 4,
      maxRange: pageCount,
    };
  }

  return { minRange: DEFAULT_MIN_RANGE, maxRange: DEFAULT_MAX_RANGE };
}

const PaginationContext = createContext<BasePaginationProps>({
  currentPage: 0,
  pageCount: 0,
});

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
  classNames,
  currentPage = 1,
  pageCount,
  onChange,
  isLoading = false,
  ...rest
}: BasePaginationProps) {
  return (
    <Pagination.Provider value={{ currentPage, pageCount }}>
      <nav
        {...rest}
        className={container({ className: classNames?.container })}
        aria-label={`pagination, page ${currentPage} of ${pageCount}`}
      >
        <Pagination.Previous
          onPress={() => {
            if (currentPage > 1) {
              onChange?.(currentPage - 1);
            }
          }}
          className={classNames?.controls}
        />
        <Pagination.NumberContainer
          onPress={(nextPage) => onChange?.(nextPage)}
          className={classNames?.pages}
          isLoading={isLoading}
        />
        <Pagination.Next
          onPress={() => {
            if (currentPage < pageCount) {
              onChange?.(currentPage + 1);
            }
          }}
          className={classNames?.controls}
        />
      </nav>
    </Pagination.Provider>
  );
}

function PaginationProvider({
  children,
  ...props
}: ProviderProps<BasePaginationProps>) {
  return (
    <PaginationContext.Provider value={props.value}>
      {children}
    </PaginationContext.Provider>
  );
}
PaginationProvider.displayName = 'Pagination.Provider';

function PaginationPrevious({ className, onPress }: PaginationNavProps) {
  const { currentPage, pageCount } = useContext(PaginationContext);

  return (
    <Button
      color='accent'
      variant='icon'
      className={button({ className })}
      isDisabled={
        currentPage === 1 || !pageCount || pageCount < 1 || currentPage < 1
      }
      onPress={() => onPress?.()}
      aria-label='pagination-previous'
    >
      <Icon>
        <ChevronLeft />
      </Icon>
    </Button>
  );
}
PaginationPrevious.displayName = 'Pagination.Previous';

function PaginationNext({ className, onPress }: PaginationNavProps) {
  const { currentPage, pageCount } = useContext(PaginationContext);

  return (
    <Button
      color='accent'
      variant='icon'
      isDisabled={
        currentPage === pageCount ||
        !pageCount ||
        pageCount < 1 ||
        currentPage < 1
      }
      onPress={() => onPress?.()}
      className={button({ className })}
      aria-label='pagination-next'
    >
      <Icon>
        <ChevronRight />
      </Icon>
    </Button>
  );
}
PaginationNext.displayName = 'Pagination.Next';

function PaginationPageNumber({
  isSelected,
  pageNumber,
  onPress,
  className,
}: PaginationPageNumberProps) {
  return (
    <ToggleButton
      color={isSelected ? 'accent' : 'mono-bold'}
      variant='flat'
      isSelected={isSelected}
      className={button({ className })}
      onPress={() => onPress?.()}
      aria-current={isSelected ? 'page' : undefined}
    >
      {pageNumber}
    </ToggleButton>
  );
}
PaginationPageNumber.displayName = 'Pagination.PageNumber';

function PaginationNumberContainer({
  isLoading,
  onPress,
  className,
}: PaginationNumberContainerProps) {
  const { pageCount, currentPage } = useContext(PaginationContext);
  if (!(pageCount && currentPage) || isLoading) {
    return null;
  }

  const { minRange, maxRange } = getPaginationRange(pageCount, currentPage);

  // No display for invalid props.
  if (minRange === 0 || maxRange === 0) {
    return null;
  }

  return range(minRange, maxRange).map((pageNumber) => (
    <PaginationPageNumber
      pageNumber={pageNumber}
      key={`page-${pageNumber}`}
      isSelected={pageNumber === currentPage}
      onPress={() => onPress?.(pageNumber)}
      className={className}
    />
  ));
}
PaginationNumberContainer.displayName = 'Pagination.NumberContainer';

Pagination.Provider = PaginationProvider;
Pagination.Previous = PaginationPrevious;
Pagination.NumberContainer = PaginationNumberContainer;
Pagination.Next = PaginationNext;
