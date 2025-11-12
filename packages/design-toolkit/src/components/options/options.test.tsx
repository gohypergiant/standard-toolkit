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
import { OptionsItem } from './item';
import { OptionsItemLabel } from './item-label';
import { OptionsSection } from './section';
import type { OptionsDataItem, OptionsProps } from './types';

function setup({
  children = (
    <>
      <OptionsSection
        header='North American Birds'
        classNames={{ section: 'w-[200px]' }}
      >
        <OptionsItem textValue='Blue Jay'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Blue Jay</OptionsItemLabel>
        </OptionsItem>
        <OptionsItem textValue='Gray catbird'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Gray catbird</OptionsItemLabel>
        </OptionsItem>
        <OptionsItem textValue='Black-capped chickadee'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Black-capped chickadee</OptionsItemLabel>
        </OptionsItem>
        <OptionsItem textValue='Song Sparrow'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Song Sparrow</OptionsItemLabel>
        </OptionsItem>
      </OptionsSection>
      <OptionsSection header='African Birds'>
        <OptionsItem textValue='Lilac-breasted roller'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Lilac-breasted roller</OptionsItemLabel>
        </OptionsItem>
        <OptionsItem textValue='Hornbill'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Hornbill</OptionsItemLabel>
        </OptionsItem>
      </OptionsSection>
    </>
  ),
  ...rest
}: Partial<OptionsProps<OptionsDataItem>> = {}) {
  render(
    <Options aria-label='Bird options' {...rest}>
      {children}
    </Options>,
  );

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
