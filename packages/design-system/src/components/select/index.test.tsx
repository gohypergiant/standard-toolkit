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
import { SelectValue } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { AriaFieldError, AriaLabel, AriaText } from '../aria';
import { Button } from '../button';
import { Icon } from '../icon';
import { Options, OptionsItem, OptionsList } from '../options';
import { Select } from './';
import type { SelectProps } from './types';

function setup({
  children = (
    <>
      <AriaLabel>Foo</AriaLabel>
      <Button variant='hollow'>
        <SelectValue />
        <Icon>
          <svg
            viewBox='0 0 24 25'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>Chevron Up Icon</title>
            <path
              d='M6.41417 8.94775L12.0711 14.6046L17.7279 8.94775L19.1421 10.3618L13.4852 16.0188C13.4852 16.0188 12.071 17.433 10.6569 16.0189C9.24274 14.6047 5 10.362 5 10.362L6.41417 8.94775Z'
              fill='#898989'
            />
          </svg>
        </Icon>
      </Button>
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
}: Partial<SelectProps<object>> = {}) {
  render(<Select {...rest}>{children}</Select>);

  return {
    ...rest,
    children,
  };
}

describe('Select', () => {
  it('should render', () => {
    setup();

    expect(screen.getByText('Foo')).toBeInTheDocument();
  });
});
