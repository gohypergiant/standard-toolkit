/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { TextField } from '@accelint/design-toolkit';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import type { TextFieldProps } from '@accelint/design-toolkit/components/text-field/types';

// ---------------------------------------------------------------------------
// Interactive state tests — size dimension only
// ---------------------------------------------------------------------------

const variants = generateVariantMatrix<
  Pick<TextFieldProps, 'size' | 'label' | 'description'>
>({
  dimensions: {
    size: ['small', 'medium'],
  },
  baseProps: {
    label: 'Label',
    description: 'Description',
  },
});

createInteractiveVisualTests({
  componentName: 'TextField',
  renderComponent: (props) => <TextField {...props} defaultValue='Value' />,
  testId: 'test-text-field',
  variants,
  states: ['default', 'hover', 'focus', 'disabled'],
  className: 'p-s',
});

// ---------------------------------------------------------------------------
// Scenario tests — configuration variants
// ---------------------------------------------------------------------------

createVisualTestScenarios('TextField', [
  {
    name: 'with placeholder',
    render: () => (
      <TextField
        size='medium'
        label='Label'
        description='Description'
        placeholder='Enter text...'
      />
    ),
    screenshotName: 'text-field-placeholder.png',
    className: 'inline-block p-s',
  },
  {
    name: 'invalid with error (medium)',
    render: () => (
      <TextField
        size='medium'
        label='Label'
        isInvalid
        errorMessage='This field is required'
        defaultValue='Bad value'
      />
    ),
    screenshotName: 'text-field-invalid-medium.png',
    className: 'inline-block p-s',
  },
  {
    name: 'invalid with error (small)',
    render: () => (
      <TextField
        size='small'
        isInvalid
        errorMessage='This field is required'
        defaultValue='Bad value'
      />
    ),
    screenshotName: 'text-field-invalid-small.png',
    className: 'inline-block p-s',
  },
  {
    name: 'readonly (medium)',
    render: () => (
      <TextField
        size='medium'
        label='Label'
        isReadOnly
        defaultValue='Read-only value'
      />
    ),
    screenshotName: 'text-field-readonly-medium.png',
    className: 'inline-block p-s',
  },
  {
    name: 'readonly (small)',
    render: () => (
      <TextField size='small' isReadOnly defaultValue='Read-only value' />
    ),
    screenshotName: 'text-field-readonly-small.png',
    className: 'inline-block p-s',
  },
  {
    name: 'required (medium)',
    render: () => (
      <TextField
        size='medium'
        label='Label'
        isRequired
        defaultValue='Required value'
      />
    ),
    screenshotName: 'text-field-required-medium.png',
    className: 'inline-block p-s',
  },
  {
    name: 'with prefix',
    render: () => (
      <TextField
        size='medium'
        label='Price'
        inputProps={{ prefix: '$' }}
        defaultValue='100'
      />
    ),
    screenshotName: 'text-field-prefix.png',
    className: 'inline-block p-s',
  },
  {
    name: 'with suffix',
    render: () => (
      <TextField
        size='medium'
        label='Weight'
        inputProps={{ suffix: 'kg' }}
        defaultValue='50'
      />
    ),
    screenshotName: 'text-field-suffix.png',
    className: 'inline-block p-s',
  },
  {
    name: 'with prefix and suffix',
    render: () => (
      <TextField
        size='medium'
        label='Temperature'
        inputProps={{ prefix: '~', suffix: '°C' }}
        defaultValue='22'
      />
    ),
    screenshotName: 'text-field-prefix-suffix.png',
    className: 'inline-block p-s',
  },
  {
    name: 'disabled with value',
    render: () => (
      <TextField
        size='medium'
        label='Label'
        description='Description'
        isDisabled
        defaultValue='Disabled value'
      />
    ),
    screenshotName: 'text-field-disabled.png',
    className: 'inline-block p-s',
  },
]);
