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
import { SearchFieldStyles, SearchFieldStylesDefaults } from './styles';
import type { SearchFieldProps } from './types';

const { field, input, search, loading, clear } = SearchFieldStyles();

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
    variant = SearchFieldStylesDefaults.variant,
    ...rest
  } = props;

  return (
    <IconProvider size='small'>
      <AriaSearchField
        {...rest}
        ref={ref}
        className={composeRenderProps(classNames?.field, (className) =>
          field({ className, variant }),
        )}
      >
        <Icon className={search({ className: classNames?.search, variant })}>
          <Search />
        </Icon>
        <Input
          {...inputProps}
          className={composeRenderProps(classNames?.input, (className) =>
            input({ className, variant }),
          )}
          type='search'
        />
        {isLoading ? (
          <Icon
            className={loading({ className: classNames?.loading, variant })}
          >
            <Loop />
          </Icon>
        ) : (
          <Button
            className={composeRenderProps(classNames?.clear, (className) =>
              clear({ className, variant }),
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
