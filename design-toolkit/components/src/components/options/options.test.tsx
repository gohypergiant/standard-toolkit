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

import Placeholder from '@accelint/icons/placeholder';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { IOptionsItem } from '../options-item';
import { Options, type OptionsProps } from './index';

function setup({
  children = (
    <>
      <Options.Section header='North American Birds' className='w-[200px]'>
        <Options.Item prefixIcon={<Placeholder />} name='Blue Jay'>
          Blue Jay
        </Options.Item>
        <Options.Item prefixIcon={<Placeholder />} name='Gray catbird'>
          Gray catbird
        </Options.Item>
        <Options.Item
          prefixIcon={<Placeholder />}
          name='Black-capped chickadee'
        >
          Black-capped chickadee
        </Options.Item>
        <Options.Item prefixIcon={<Placeholder />} name='Song Sparrow'>
          Song Sparrow
        </Options.Item>
      </Options.Section>
      <Options.Section header='African Birds'>
        <Options.Item prefixIcon={<Placeholder />} name='Lilac-breasted roller'>
          Lilac-breasted roller
        </Options.Item>
        <Options.Item prefixIcon={<Placeholder />} name='Hornbill'>
          Hornbill
        </Options.Item>
      </Options.Section>
    </>
  ),
  ...rest
}: Partial<OptionsProps<IOptionsItem>> = {}) {
  render(<Options {...rest}>{children}</Options>);

  return {
    ...rest,
    children,
  };
}

describe('Options', () => {
  it('should render', () => {
    setup();

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
});
