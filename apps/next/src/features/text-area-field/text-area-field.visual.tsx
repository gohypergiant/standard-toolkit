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

import { TextAreaField } from '@accelint/design-toolkit';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import type { TextAreaFieldProps } from '@accelint/design-toolkit/components/text-area-field/types';

// ---------------------------------------------------------------------------
// Interactive state tests — size dimension only
// ---------------------------------------------------------------------------

const variants = generateVariantMatrix<
  Pick<TextAreaFieldProps, 'size' | 'label' | 'description'>
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
  componentName: 'TextAreaField',
  renderComponent: (props) => <TextAreaField {...props} defaultValue='Value' />,
  testId: 'test-text-area-field',
  variants,
  states: ['default', 'hover', 'focus', 'disabled'],
  className: 'p-s',
});

// ---------------------------------------------------------------------------
// Scenario tests — configuration variants
// ---------------------------------------------------------------------------

createVisualTestScenarios('TextAreaField', [
  {
    name: 'placeholder',
    render: () => (
      <TextAreaField
        size='medium'
        label='Label'
        description='Description'
        inputProps={{ placeholder: 'Enter a value...' }}
      />
    ),
    screenshotName: 'text-area-field-placeholder.png',
    className: 'inline-block p-s',
  },
  {
    name: 'invalid (medium)',
    render: () => (
      <TextAreaField
        size='medium'
        label='Label'
        isInvalid
        errorMessage='This field is required'
        defaultValue='Value'
      />
    ),
    screenshotName: 'text-area-field-invalid-medium.png',
    className: 'inline-block p-s',
  },
  {
    name: 'invalid (small)',
    render: () => (
      <TextAreaField
        size='small'
        isInvalid
        errorMessage='This field is required'
        defaultValue='Value'
      />
    ),
    screenshotName: 'text-area-field-invalid-small.png',
    className: 'inline-block p-s',
  },
  {
    name: 'readonly (medium)',
    render: () => (
      <TextAreaField
        size='medium'
        label='Label'
        description='Description'
        isReadOnly
        defaultValue='Read-only value'
      />
    ),
    screenshotName: 'text-area-field-readonly-medium.png',
    className: 'inline-block p-s',
  },
  {
    name: 'readonly (small)',
    render: () => (
      <TextAreaField size='small' isReadOnly defaultValue='Read-only value' />
    ),
    screenshotName: 'text-area-field-readonly-small.png',
    className: 'inline-block p-s',
  },
  {
    name: 'required (medium)',
    render: () => (
      <TextAreaField
        size='medium'
        label='Label'
        description='Description'
        isRequired
        defaultValue='Value'
      />
    ),
    screenshotName: 'text-area-field-required-medium.png',
    className: 'inline-block p-s',
  },
  {
    name: 'disabled with value',
    render: () => (
      <TextAreaField
        size='medium'
        label='Label'
        description='Description'
        isDisabled
        defaultValue='Disabled value'
      />
    ),
    screenshotName: 'text-area-field-disabled.png',
    className: 'inline-block p-s',
  },
]);
