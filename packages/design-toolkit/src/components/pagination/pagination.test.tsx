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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './index';
import { getPaginationRange } from './utils';
import type { PaginationProps } from './types';

function setup(props: PaginationProps) {
  return {
    ...render(<Pagination {...props} />),
    ...props,
  };
}

describe('Pagination', () => {
  it('should render', () => {
    setup({ value: 1, total: 5, onChange: vi.fn() });

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByRole('navigation').children).toHaveLength(7);
  });

  it('should trigger onChange when button is pressed', async () => {
    const { onChange } = setup({
      value: 1,
      total: 5,
      onChange: vi.fn(),
    });

    await userEvent.click(screen.getByLabelText('Next page'));

    expect(onChange).toHaveBeenCalled();
  });

  it('previous button should be disabled when first page is active', () => {
    setup({ value: 1, total: 5, onChange: vi.fn() });

    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('next button should be disabled when last page is active', () => {
    setup({ value: 5, total: 5, onChange: vi.fn() });

    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('should disable both prev/next for single pageCount', () => {
    setup({ value: 1, total: 1, onChange: vi.fn() });

    expect(screen.getByLabelText('Next page')).toBeDisabled();
    expect(screen.getByLabelText('Previous page')).toBeDisabled();

    expect(screen.getByRole('navigation').children).toHaveLength(3);
  });

  it('should show empty component on pageCount < 1', () => {
    setup({ value: 1, total: 0, onChange: vi.fn() });

    expect(screen.getByRole('navigation').children).toHaveLength(2);
  });

  it('should show empty component on currentPage < 1', () => {
    setup({ value: -3, total: 5, onChange: vi.fn() });

    expect(screen.getByRole('navigation').children).toHaveLength(2);
  });

  it('should show empty component on currentPage > pageCount', () => {
    setup({ value: 6, total: 5, onChange: vi.fn() });

    expect(screen.getByRole('navigation').children).toHaveLength(2);
  });

  describe('getPaginationRange()', () => {
    it('should return 1-5', () => {
      const { minRange, maxRange } = getPaginationRange(5, 1);

      expect(minRange).toEqual(1);
      expect(maxRange).toEqual(5);
    });

    it('should return last 5 pages', () => {
      const { minRange, maxRange } = getPaginationRange(10, 10);

      expect(minRange).toEqual(6);
      expect(maxRange).toEqual(10);
    });

    it('should return middle range of pages', () => {
      const { minRange, maxRange } = getPaginationRange(10, 4);
      // 4 being current page, should be in the middle.
      expect(minRange).toEqual(2);
      expect(maxRange).toEqual(6);
    });
  });
});
