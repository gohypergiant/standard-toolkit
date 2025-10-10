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
import { range } from 'lodash';
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

// Return min max range for visible pages. As per our design, we limit
// the range of numbers to a spread of 5 maximum, getting the lower and upper bounds.
function getPaginationRange(
  pageCount: number,
  currentPage: number,
): PaginationRange {
  if (!(pageCount && currentPage)) {
    return { minRange: DEFAULT_MIN_RANGE, maxRange: DEFAULT_MAX_RANGE };
  }

  // Below max display.
  if (pageCount < 5) {
    return {
      minRange: 1,
      maxRange: pageCount,
    };
  }

  // Middle.
  if (currentPage >= 3 && currentPage <= pageCount - 3) {
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

const PaginationContext = createContext<BasePaginationProps>({});

/**
 *
 * Pagination - A lightweight implementation for page navigation.
 *
 * @example
 * <Pagination currentPage={1} pageCount={5} onChange={handleOnChange} />
 */
export function Pagination({
  children,
  classNames,
  currentPage,
  pageCount,
  onChange,
  ...rest
}: BasePaginationProps) {
  return (
    <Pagination.Provider value={{ currentPage, pageCount }}>
      <div
        className={container({ className: classNames?.container })}
        {...rest}
      >
        <Pagination.Previous
          onPress={() => onChange?.(currentPage! - 1)}
          className={classNames?.controls}
        />
        <Pagination.NumberContainer
          onPress={(nextPage) => onChange?.(nextPage)}
          className={classNames?.pages}
        />
        <Pagination.Next
          onPress={() => onChange?.(currentPage! + 1)}
          className={classNames?.controls}
        />
      </div>
    </Pagination.Provider>
  );
}
Pagination.displayName = 'Pagination';

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

function PaginationPrevious({
  className,
  onPress,
  ...rest
}: PaginationNavProps) {
  const { currentPage } = useContext(PaginationContext);

  return (
    <Button
      color='accent'
      variant='icon'
      className={button({ className })}
      isDisabled={currentPage === 1}
      onPress={() => onPress?.()}
      {...rest}
    >
      <Icon>
        <ChevronLeft />
      </Icon>
    </Button>
  );
}
PaginationPrevious.displayName = 'Pagination.Previous';

function PaginationNext({ className, onPress, ...rest }: PaginationNavProps) {
  const { currentPage, pageCount: pages } = useContext(PaginationContext);

  return (
    <Button
      color='accent'
      variant='icon'
      isDisabled={currentPage === pages}
      onPress={() => onPress?.()}
      className={button({ className })}
      {...rest}
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
    >
      {pageNumber}
    </ToggleButton>
  );
}
PaginationPageNumber.displayName = 'Pagination.PageNumber';

function PaginationNumberContainer({
  onPress,
  className,
}: PaginationNumberContainerProps) {
  const { pageCount: pages, currentPage } = useContext(PaginationContext);
  if (!(pages && currentPage)) {
    return;
  }

  const { minRange, maxRange } = getPaginationRange(pages, currentPage);

  // range is not inclusive of upper limit, + 1
  return range(minRange, maxRange + 1).map((pageNumber) => (
    <>
      <PaginationPageNumber
        pageNumber={pageNumber}
        key={`page-${pageNumber}`}
        isSelected={pageNumber === currentPage}
        onPress={() => onPress?.(pageNumber)}
        className={className}
      />
    </>
  ));
}
PaginationNumberContainer.displayName = 'Pagination.NumberContainer';

Pagination.Provider = PaginationProvider;
Pagination.Previous = PaginationPrevious;
Pagination.NumberContainer = PaginationNumberContainer;
Pagination.Next = PaginationNext;
