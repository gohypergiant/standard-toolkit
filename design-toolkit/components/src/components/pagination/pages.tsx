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
import { useContext, useMemo } from 'react';
import { composeRenderProps } from 'react-aria-components';
import { ToggleButton } from '../button/toggle';
import { PaginationContext } from './context';
import { PaginationStyles } from './styles';
import { getPaginationRange, range } from './utils';
import type { PaginationPagesProps } from './types';

const { button } = PaginationStyles();

export function PaginationPages({ className, onPress }: PaginationPagesProps) {
  const { page, total, isLoading, setPage } = useContext(PaginationContext);
  const { minRange, maxRange } = useMemo(
    () => getPaginationRange(total, page),
    [total, page],
  );
  const pages = useMemo(() => range(minRange, maxRange), [minRange, maxRange]);

  // No display for invalid props.
  if (minRange === 0 || maxRange === 0 || isLoading) {
    return null;
  }

  return pages.map((number) => (
    <ToggleButton
      key={`page-${number}`}
      className={composeRenderProps(className, (className) =>
        button({ className }),
      )}
      color='accent'
      variant='flat'
      isSelected={number === page}
      onPress={() => {
        setPage(number);
        onPress?.(number);
      }}
      aria-current={number === page ? 'page' : undefined}
    >
      {number}
    </ToggleButton>
  ));
}
