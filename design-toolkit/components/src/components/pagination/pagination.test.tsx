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
import { getPaginationRange, Pagination } from './index';
import type { BasePaginationProps } from './types';

function setup(props: Partial<BasePaginationProps>) {
  return {
    ...render(<Pagination {...props} />),
    ...props,
  };
}

describe('Pagination', () => {
  it('should render', () => {
    setup({ currentPage: 1, pageCount: 5, onChange: vi.fn() });
    const navContainer = document.querySelector('nav');
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(navContainer?.children.length).toEqual(7);
  });

  it('should trigger onChange when button is pressed', async () => {
    const { onChange, container } = setup({
      currentPage: 1,
      pageCount: 5,
      onChange: vi.fn(),
    });
    userEvent.setup();
    const nextButton = container.querySelector(
      'button[aria-label="pagination-next"]',
    );
    expect(nextButton).toBeDefined();
    await userEvent.click(nextButton as Element);
    expect(onChange).toHaveBeenCalled();
  });

  it('previous button should be disabled when currentPage === 1', () => {
    setup({ currentPage: 1, pageCount: 5, onChange: vi.fn() });
    const button = document.querySelector(
      'button[aria-label="pagination-previous"]',
    );
    expect(button).not.toBeNull();
    expect(button).toBeDefined();
    expect(button as HTMLElement).toBeDisabled();
  });

  it('next button should be disabled when currentPage === pageCount', () => {
    setup({ currentPage: 5, pageCount: 5, onChange: vi.fn() });
    const button = document.querySelector(
      'button[aria-label="pagination-next"]',
    );
    expect(button).not.toBeNull();
    expect(button).toBeDefined();
    expect(button as HTMLElement).toBeDisabled();
  });

  it('should disable both prev/next for single pageCount', () => {
    setup({ currentPage: 1, pageCount: 1, onChange: vi.fn() });
    const nextButton = document.querySelector(
      'button[aria-label="pagination-next"]',
    );
    const previousButton = document.querySelector(
      'button[aria-label="pagination-previous"]',
    );
    expect(nextButton).not.toBeNull();
    expect(previousButton).not.toBeNull();
    expect(nextButton).toBeDefined();
    expect(previousButton).toBeDefined();
    expect(nextButton as HTMLElement).toBeDisabled();
    expect(previousButton as HTMLElement).toBeDisabled();

    const navContainer = document.querySelector('nav');
    // Prev, Page, Next
    expect(navContainer?.children.length).toEqual(3);
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
