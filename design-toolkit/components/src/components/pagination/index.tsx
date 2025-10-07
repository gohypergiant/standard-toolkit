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
import type { BasePaginationProps, PaginationPageNumberProps } from './types';

/*
  Notes.

  If page count > 5, we truncate.
  - i-2 i-1 i i+1 i+2, i is current index,
    - unless current index first/second, penultimate/last.
    - _.range(min, max)
  - isActive, i === currentIndex.
    - Raises the question, are we handling the state for the item,
      or is it an external thing.
  - onPageSelected(index:number) => void;
  - onPreviousSelected()/onNextSelected() => void;
*/

const { container, button, navButton } = PaginationStyles();

// Return min max range for visible pages.
function getPaginationRange(pages: number, currentPage: number) {
  if (!(pages && currentPage)) {
    return;
  }

  if (pages <= 5) {
    return {
      minRange: 1,
      maxRange: pages,
    };
  }

  const minRange = 1;
  const maxRange = 5;

  return { minRange, maxRange };
}

// ContextValue<BasePaginationProps>?
const PaginationContext = createContext<BasePaginationProps>({});

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

export function Pagination({ children, ...rest }: BasePaginationProps) {
  return (
    // TODO: Update types to pass in classNames.container etc
    <div className={container()} {...rest}>
      {children}
    </div>
  );
}
Pagination.displayName = 'Pagination';

// TODO: onPreviousPress() => void
function PaginationPrevious() {
  return (
    <Button color='accent' variant='icon' className={button()}>
      <Icon>
        <ChevronLeft />
      </Icon>
    </Button>
  );
}
PaginationPrevious.displayName = 'Pagination.Previous';

// TODO: onNextPress()
function PaginationNext() {
  return (
    <Button color='accent' variant='icon'>
      <Icon>
        <ChevronRight />
      </Icon>
    </Button>
  );
}
PaginationNext.displayName = 'Pagination.Next';

function PaginationPageNumber({
  isSelected,
  index,
}: PaginationPageNumberProps) {
  return (
    <ToggleButton
      color='accent'
      variant='icon'
      isSelected={isSelected}
      className={button()}
    >
      {index}
    </ToggleButton>
  );
}
PaginationPageNumber.displayName = 'Pagination.PageNumber';

//
function PaginationNumberContainer() {
  // include logic here for numbers?
  // get pageCount and currentIndex.
  // display 5 numbers relative to current index.
  // check 1/2 last-1/last

  // TODO: Abstract to a hook, we want to return a min and max range based
  // on the pageCount and relative currentPage
  const { pages, currentPage } = useContext(PaginationContext);
  if (!(pages && currentPage)) {
    return;
  }

  const { minRange, maxRange } = getPaginationRange(pages, currentPage);

  return range(minRange, maxRange).map((pageNumber, _index: number) => (
    <PaginationPageNumber
      index={pageNumber}
      key={`page-${pageNumber}`}
      isSelected={pageNumber === currentPage}
    />
  ));
}
PaginationNumberContainer.displayName = 'Pagination.NumberContainer';

Pagination.Provider = PaginationProvider;
Pagination.Previous = PaginationPrevious;
Pagination.NumberContainer = PaginationNumberContainer;
Pagination.Next = PaginationNext;
