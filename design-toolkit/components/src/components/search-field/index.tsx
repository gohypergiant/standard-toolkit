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
import type { ProviderProps } from '@/lib/types';
import {
  CancelFill,
  Loop as LoopIcon,
  Search as SearchIcon,
} from '@accelint/icons';
import { createContext } from 'react';
import {
  SearchField as AriaSearchField,
  Button,
  type ContextValue,
  Input,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { SearchFieldStyles } from './styles';
import type { SearchFieldProps } from './types';

const { searchField, searchIcon, input, loadingIcon, clearButton } =
  SearchFieldStyles();

export const SearchFieldContext =
  createContext<ContextValue<SearchFieldProps, HTMLDivElement>>(null);

function SearchFieldProvider({
  children,
  ...props
}: ProviderProps<SearchFieldProps>) {
  return (
    <SearchFieldContext.Provider value={props}>
      {children}
    </SearchFieldContext.Provider>
  );
}
SearchFieldProvider.displayName = 'SearchField.Provider';

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
 *     input: "bg-gray-100",
 *     searchIcon: "text-blue-600"
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
 *
 * @example
 * // Using context provider for default props
 * <SearchField.Provider variant="filled">
 *   <SearchField placeholder="Search 1" />
 *   <SearchField placeholder="Search 2" />
 * </SearchField.Provider>
 */
export function SearchField({ ref, ...props }: SearchFieldProps) {
  [props, ref] = useContextProps(props, ref ?? null, SearchFieldContext);

  const {
    classNames,
    inputProps,
    isLoading = false,
    placeholder,
    variant = 'outlined',
    ...rest
  } = props;

  return (
    <AriaSearchField
      className={composeRenderProps(
        classNames?.searchField,
        (resolvedClassName) => searchField({ className: resolvedClassName }),
      )}
      {...rest}
    >
      <Icon className={searchIcon({ className: classNames?.searchIcon })}>
        <SearchIcon />
      </Icon>
      <Input
        {...inputProps}
        className={input({ variant, className: classNames?.input })}
        placeholder={placeholder}
      />
      {isLoading ? (
        <Icon className={loadingIcon({ className: classNames?.loadingIcon })}>
          <LoopIcon />
        </Icon>
      ) : (
        <Button className={clearButton({ className: classNames?.clearButton })}>
          <Icon>
            <CancelFill />
          </Icon>
        </Button>
      )}
    </AriaSearchField>
  );
}

SearchField.displayName = 'SearchField';
SearchField.Provider = SearchFieldProvider;
