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
import ChevronLeft from '@accelint/icons/chevron-left';
import clsx from 'clsx';
import { useContext } from 'react';
import { composeRenderProps } from 'react-aria-components';
import { Button } from '../button';
import { Icon } from '../icon';
import { PaginationContext } from './context';
import styles from './styles.module.css';
import { isNavigationDisabled } from './utils';
import type { PaginationPrevProps } from './types';

export function PaginationPrev({ className, onPress }: PaginationPrevProps) {
  const { page, total, setPage } = useContext(PaginationContext);

  return (
    <Button
      className={composeRenderProps(className, (className) =>
        clsx(styles.button, className),
      )}
      color='accent'
      variant='icon'
      isDisabled={page === 1 || isNavigationDisabled(total, page)}
      onPress={() => {
        setPage(page - 1);
        onPress?.(page - 1);
      }}
      aria-label='Previous page'
    >
      <Icon>
        <ChevronLeft />
      </Icon>
    </Button>
  );
}
