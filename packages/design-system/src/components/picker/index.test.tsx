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
import { describe, expect, it } from 'vitest';
import { Picker, PickerItem } from './';
import type { PickerProps } from './types';

function setup({
  'aria-label': ariaLabel = 'Test',
  ...rest
}: Partial<PickerProps<object>> = {}) {
  render(<Picker {...rest} aria-label={ariaLabel} />);

  return {
    ...rest,
    'aria-label': ariaLabel,
  };
}

describe('Picker', () => {
  it('should render empty state', () => {
    const empty = 'No options';

    setup({
      renderEmptyState: () => empty,
    });

    expect(screen.getByText(empty)).toBeInTheDocument();
  });

  it('should render options', () => {
    const option = 'Hello';

    setup({
      children: <PickerItem>{option}</PickerItem>,
    });

    expect(screen.getByText(option)).toBeInTheDocument();
  });
});
