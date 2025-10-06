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
import { createContext } from 'react';
import { Button, ToggleButton } from '../button';
import { Icon } from '../icon';
import type { ProviderProps } from 'react';
import type { ContextValue } from 'react-aria-components';
import type { BasePaginationProps, PaginationControlProps } from './types';

export const PaginationContext =
  createContext<ContextValue<BasePaginationProps, HTMLDivElement>>(null);

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

function Pagination(props: any) {
  return (
    <div className='flex flex-row gap-s'>
      <PaginationControl direction='left' />
      <ToggleButton variant='flat' color='accent'>
        1
      </ToggleButton>
      <PaginationControl direction='right' />
    </div>
  );
}
Pagination.displayName = 'Pagination';

function PaginationControl({ direction }: PaginationControlProps) {
  return (
    <Button>
      <Icon>{direction === 'left' ? <ChevronLeft /> : <ChevronRight />}</Icon>
    </Button>
  );
}
PaginationControl.displayName = 'Pagination.Control';

function PaginationNumberContainer() {
  return (
    <div className='flex flex-row'>
      {/* Get count of numbers, forEach map */}
    </div>
  );
}

Pagination.Provider = PaginationProvider;
Pagination.Control = PaginationControl;
// pagination-number-container
// uses flat-toggle button, accent
