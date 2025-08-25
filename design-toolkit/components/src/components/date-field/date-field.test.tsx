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

import { parseDate } from '@internationalized/date';
import { render, screen } from '@testing-library/react';
import type { DateValue } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { DateField } from './index';
import type { DateFieldProps } from './types';

function setup({
  defaultValue = parseDate('2020-01-23'),
}: Partial<DateFieldProps<DateValue>> = {}) {
  render(<DateField defaultValue={defaultValue} />);
}

describe('DateField', () => {
  it('should render', () => {
    setup();

    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('JAN')).toBeInTheDocument();
    expect(screen.getByText('23')).toBeInTheDocument();
  });
});
