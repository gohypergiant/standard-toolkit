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
import { AriaFieldError, AriaGroup, AriaLabel, AriaText } from '../aria';
import { Button } from '../button';
import { Icon } from '../icon';
import { Input } from '../input';
import { Options, OptionsItem, OptionsList } from '../options';
import { ComboBox } from './';
import type { ComboBoxProps } from './types';

function setup({
  children = (
    <>
      <AriaLabel>Foo</AriaLabel>
      <AriaGroup>
        <Input />
        <Button>
          <Icon>
            <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              <title>Ladle</title>
              <path d='M17.6577 15.6996L12.0008 10.0427L6.34391 15.6996L4.92969 14.2855L10.5867 8.62855C10.5867 8.62855 12.0009 7.21436 13.415 8.62847C14.8291 10.0426 19.0718 14.2854 19.0718 14.2854L17.6577 15.6996Z' />
            </svg>
          </Icon>
        </Button>
      </AriaGroup>
      <AriaText slot='description'>Bar</AriaText>
      <AriaFieldError>Oh no!</AriaFieldError>
      <Options isOpen>
        <OptionsList>
          <OptionsItem>Aardvark</OptionsItem>
          <OptionsItem>Cat</OptionsItem>
          <OptionsItem>Dog</OptionsItem>
          <OptionsItem>Kangaroo</OptionsItem>
          <OptionsItem>Panda</OptionsItem>
          <OptionsItem>Snake</OptionsItem>
        </OptionsList>
      </Options>
    </>
  ),
  ...rest
}: Partial<ComboBoxProps<object>> = {}) {
  render(<ComboBox {...rest}>{children}</ComboBox>);

  return {
    ...rest,
    children,
  };
}

describe('ComboBox', () => {
  it('should render', () => {
    setup();

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
