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
import type { IOptionsItem } from '../options/types';
import { ComboBox, type ComboBoxProps } from './index';

function setup({
  children = (
    <>
      <ComboBox.Item isDisabled>
        <ComboBox.Item.Label>Red Panda</ComboBox.Item.Label>
        <ComboBox.Item.Description>Some ice cream</ComboBox.Item.Description>
      </ComboBox.Item>
      <ComboBox.Item>
        <ComboBox.Item.Label>Cat</ComboBox.Item.Label>
        <ComboBox.Item.Description>Some ice cream</ComboBox.Item.Description>
      </ComboBox.Item>
      <ComboBox.Item>
        <ComboBox.Item.Label>Dog</ComboBox.Item.Label>
        <ComboBox.Item.Description>Some ice cream</ComboBox.Item.Description>
      </ComboBox.Item>
    </>
  ),
  ...rest
}: Partial<ComboBoxProps<IOptionsItem>> = {}) {
  render(<ComboBox {...rest}>{children}</ComboBox>);

  return {
    ...rest,
    children,
  };
}

describe('Combobox', () => {
  it('should render', () => {
    setup();

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
