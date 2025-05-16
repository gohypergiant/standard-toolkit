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
import { Checkbox, CheckboxGroup } from '.';
import { AriaText } from '../aria';
import type { CheckboxProps } from './types';

function setup({ children = 'Foo', ...rest }: Partial<CheckboxProps> = {}) {
  render(<Checkbox {...rest}>{children}</Checkbox>);

  return {
    ...rest,
    children,
  };
}

describe('Checkbox', () => {
  it('should render', () => {
    const { children } = setup();

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText(`${children}`)).toBeInTheDocument();
  });
});

describe('Checkbox Group', () => {
  it('should render', () => {
    const checkboxes = ['Foo', 'Bar', 'Baz'];

    render(
      <CheckboxGroup>
        {checkboxes.map((value) => (
          <Checkbox key={value} value={value}>
            <AriaText>{value}</AriaText>
          </Checkbox>
        ))}
      </CheckboxGroup>,
    );

    expect(screen.getByRole('group')).toBeInTheDocument();
  });
});
