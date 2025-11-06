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
import { OptionsItem } from '../options/item';
import { OptionsItemDescription } from '../options/item-description';
import { OptionsItemLabel } from '../options/item-label';
import { SelectField } from './';
import type { SelectFieldProps } from './types';

function setup({
  children = (
    <>
      <OptionsItem isDisabled>
        <OptionsItemLabel>Red Panda</OptionsItemLabel>
        <OptionsItemDescription>Some ice cream</OptionsItemDescription>
      </OptionsItem>
      <OptionsItem>
        <OptionsItemLabel>Cat</OptionsItemLabel>
        <OptionsItemDescription>Some ice cream</OptionsItemDescription>
      </OptionsItem>
      <OptionsItem>
        <OptionsItemLabel>Dog</OptionsItemLabel>
        <OptionsItemDescription>Some ice cream</OptionsItemDescription>
      </OptionsItem>
    </>
  ),
  ...rest
}: Partial<SelectFieldProps> = {}) {
  render(<SelectField {...rest}>{children}</SelectField>);

  return {
    ...rest,
    children,
  };
}

describe('Select', () => {
  it('renders', () => {
    setup({ label: 'Select Things', isRequired: true });

    expect(screen.getByText('Select Things')).toBeInTheDocument();
  });
});
