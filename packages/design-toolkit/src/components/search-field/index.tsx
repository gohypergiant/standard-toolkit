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

import { CancelFill, Loop, Search } from '@accelint/icons';
import 'client-only';
import clsx from 'clsx';
import {
  SearchField as AriaSearchField,
  Button,
  composeRenderProps,
  Input,
  useContextProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { IconProvider } from '../icon/context';
import { SearchFieldContext } from './context';
import styles from './styles.module.css';
import type { SearchFieldProps } from './types';

/**
 * SearchField - A customizable search input component built on React Aria Components
 *
 * Provides a search input with integrated search icon, loading state, and clear functionality.
 * Supports two visual variants (filled/outlined), and granular styling control.
 *
 * @example
 * // Basic search field
 * <SearchField placeholder="Search..." />
 *
 * @example
 * // Filled variant with custom styling
 * <SearchField
 *   variant="filled"
 *   placeholder="Search products"
 *   classNames={{
 *     input: "bg-info-bold",
 *     searchIcon: "fg-accent-primary-bold"
 *   }}
 * />
 *
 * @example
 * // With event handlers
 * <SearchField
 *   placeholder="Type to search"
 *   onSubmit={(value) => console.log('Search:', value)}
 *   onChange={(value) => setQuery(value)}
 * />
 */
export function SearchField({ ref, ...props }: SearchFieldProps) {
  [props, ref] = useContextProps(props, ref ?? null, SearchFieldContext);

  const {
    classNames,
    inputProps,
    isLoading = false,
    variant = 'outline',
    ...rest
  } = props;

  return (
    <IconProvider size='small'>
      <AriaSearchField
        {...rest}
        ref={ref}
        className={composeRenderProps(classNames?.field, (className) =>
          clsx('group/search-field', styles.field, styles[variant], className),
        )}
      >
        <Icon className={clsx(styles.search, classNames?.search)}>
          <Search />
        </Icon>
        <Input
          {...inputProps}
          className={composeRenderProps(classNames?.input, (className) =>
            clsx(styles.input, className),
          )}
          type='search'
        />
        {isLoading ? (
          <Icon className={clsx(styles.loading, classNames?.loading)}>
            <Loop />
          </Icon>
        ) : (
          <Button
            className={composeRenderProps(classNames?.clear, (className) =>
              clsx(styles.clear, className),
            )}
          >
            <Icon>
              <CancelFill />
            </Icon>
          </Button>
        )}
      </AriaSearchField>
    </IconProvider>
  );
}
