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

import { SearchField } from '@/components/search-field/index';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('SearchField', () => {
  const placeholder = 'Search';

  it('should render', () => {
    render(
      <SearchField
        placeholder={placeholder}
        aria-label='Test Search Field Component'
      />,
    );

    const input = screen.getByPlaceholderText(placeholder);

    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('outline-interactive');
    expect(input).not.toHaveClass('outline-static-dark');
    expect(input).not.toHaveClass('bg-surface-raised');
  });

  it('should render with custom classNames', () => {
    const selector = 'search-field';

    render(
      <SearchField
        aria-label='Test Search Field'
        classNames={{
          searchField: 'custom-search-field',
          input: 'custom-input',
        }}
        data-testid={selector}
      />,
    );

    const searchField = screen.getByTestId(selector);

    expect(searchField).toHaveClass('custom-search-field');
  });

  it('should show loading state', () => {
    render(
      <SearchField
        aria-label='Loading Search Field'
        classNames={{ loadingIcon: 'loading-icon' }}
        isLoading={true}
        placeholder='Loading search'
      />,
    );

    const loadingIcon = document.getElementsByClassName('loading-icon')[0];

    // In loading state, the loading icon should be visible
    expect(loadingIcon).toBeInTheDocument();

    // and the clear button should not be visible
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render filled variant', () => {
    render(
      <SearchField
        placeholder={placeholder}
        variant='filled'
        aria-label='Filled Search Field'
        data-testid='filled-search'
      />,
    );

    const input = screen.getByPlaceholderText(placeholder);

    expect(input).toBeInTheDocument();
    expect(input).not.toHaveClass('outline-interactive');
    expect(input).toHaveClass('outline-static-dark');
    expect(input).toHaveClass('bg-surface-raised');
  });

  it('should work with Provider context', () => {
    const value = 'hello world';

    render(
      <SearchField.Provider value={value} variant='filled'>
        <SearchField
          aria-label='Context test'
          data-testid='context-search'
          placeholder={placeholder}
        />
      </SearchField.Provider>,
    );

    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    // the value is passed from the provider to the input; things are "wired" up properly
    expect(input.value).toBe(value);
  });

  it('should render with all classNames options', () => {
    render(
      <SearchField
        placeholder='All classes test'
        classNames={{
          searchField: 'custom-search-field',
          searchIcon: 'custom-search-icon',
          input: 'custom-input',
          loadingIcon: 'custom-loading-icon',
          clearButton: 'custom-clear-button',
        }}
        aria-label='All classes test'
        data-testid='all-classes-search'
      />,
    );

    const searchField = screen.getByTestId('all-classes-search');

    expect(searchField).toHaveClass('custom-search-field');
  });
});
