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
import { AriaFieldError, AriaLabel, AriaText } from '../aria';
import { Input } from '../input';
import { TextField } from './';
import type { TextFieldProps } from './types';

function setup(props: Partial<TextFieldProps> = {}) {
  render(
    <TextField {...props}>
      <AriaLabel>Name</AriaLabel>
      <Input placeholder='Placeholder text' />
      <AriaText slot='description'>Hint</AriaText>
      <AriaFieldError>Error Message</AriaFieldError>
    </TextField>,
  );

  return props;
}

describe('TextField', () => {
  it('should render', () => {
    setup({ 'aria-label': 'text field' });

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Placeholder text')).toBeInTheDocument();
  });
});
