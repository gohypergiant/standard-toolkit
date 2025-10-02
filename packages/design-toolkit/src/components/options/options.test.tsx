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
import { Icon } from '../icon';
import { Options } from './index';
import type { OptionsDataItem, OptionsProps } from './types';

function setup({
  children = (
    <>
      <Options.Section
        header='North American Birds'
        classNames={{ section: 'w-[200px]' }}
      >
        <Options.Item>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Blue Jay</Options.Item.Label>
        </Options.Item>
        <Options.Item>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Gray catbird</Options.Item.Label>
        </Options.Item>
        <Options.Item>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Black-capped chickadee</Options.Item.Label>
        </Options.Item>
        <Options.Item>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Song Sparrow</Options.Item.Label>
        </Options.Item>
      </Options.Section>
      <Options.Section header='African Birds'>
        <Options.Item>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Lilac-breasted roller</Options.Item.Label>
        </Options.Item>
        <Options.Item>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Hornbill</Options.Item.Label>
        </Options.Item>
      </Options.Section>
    </>
  ),
  ...rest
}: Partial<OptionsProps<OptionsDataItem>> = {}) {
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
