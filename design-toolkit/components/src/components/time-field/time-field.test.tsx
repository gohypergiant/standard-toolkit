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

import { parseTime } from '@internationalized/date';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TimeField } from './';
import type { TimeValue } from 'react-aria-components';
import type { TimeFieldProps } from './types';

function setup({
  defaultValue = parseTime('20:30:40'),
}: Partial<TimeFieldProps<TimeValue>> = {}) {
  render(<TimeField defaultValue={defaultValue} />);
}

describe('TimeField', () => {
  it('should render', () => {
    setup();

    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('should update time value when user changes it', async () => {
    const user = userEvent.setup();
    setup();

    const input = screen.getByText('30');
    const value = '7';

    await user.type(input, value);

    expect(input).toHaveValue(7);
    expect(input).not.toHaveValue(30);
  });
});
