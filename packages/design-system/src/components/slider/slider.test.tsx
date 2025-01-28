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
import { AriaLabel, AriaText } from '../aria';
import { Input } from '../input';
import { Slider, SliderBar, SliderThumb, SliderTrack } from './slider';
import type { SliderProps } from './types';

function setup({
  children = (
    <>
      <AriaLabel>Foo</AriaLabel>
      <Input />
      <SliderTrack>
        <SliderBar />
        <SliderThumb />
      </SliderTrack>
      <AriaText slot='min'>0</AriaText>
      <AriaText slot='max'>100</AriaText>
    </>
  ),
  ...rest
}: Partial<SliderProps> = {}) {
  render(<Slider {...rest}>{children}</Slider>);

  return {
    ...rest,
    children,
  };
}

describe('Slider', () => {
  it('should render', () => {
    setup();

    const element = screen.getByRole('group');

    expect(element).toBeInTheDocument();
  });
});
