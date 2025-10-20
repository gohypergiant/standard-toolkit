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
    expect(screen.getByText('1')).toBeInTheDocument();
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
    console.log(button);
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
});
