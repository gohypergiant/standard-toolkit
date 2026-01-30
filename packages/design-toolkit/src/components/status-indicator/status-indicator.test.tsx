/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
import { describe, expect, it } from 'vitest';
import { StatusIndicator } from '.';
import type { StatusIndicatorProps } from './types';

function setup({
  status = 'good',
  ...rest
}: Partial<StatusIndicatorProps> = {}) {
  render(<StatusIndicator status={status} {...rest} />);

  return {
    status,
    ...rest,
  };
}

const VALID_STATUSES: StatusIndicatorProps['status'][] = [
  'good',
  'degraded',
  'poor',
] as const;

describe('StatusIndicator', () => {
  it.each(VALID_STATUSES)('should render with %s status', (status) => {
    setup({ status });

    const indicator = screen.getByTestId(`status-${status}-icon`);
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute('data-status', status);
  });

  it('should apply custom className', () => {
    const customClass = 'custom-status-indicator';
    setup({ className: customClass });

    const indicator = screen.getByTestId('status-good-icon');
    expect(indicator).toHaveClass(customClass);
  });
});
