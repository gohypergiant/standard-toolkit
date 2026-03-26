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

import { DateField } from '@accelint/design-toolkit';
import type { DateFieldProps } from '@accelint/design-toolkit/components/date-field/types';
import { parseDateTime } from '@internationalized/date';
import type { DateValue } from 'react-aria-components';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
  generateVariantMatrix,
} from '~/visual-regression/vitest';

const dateValue = parseDateTime('2020-01-23T00:00:00');
const dateTimeValue = parseDateTime('2021-04-07T18:45:22');

// ---------------------------------------------------------------------------
// Interactive state tests — size dimension only
// ---------------------------------------------------------------------------

const variants = generateVariantMatrix<
  Pick<DateFieldProps<DateValue>, 'size' | 'label' | 'description'>
>({
  dimensions: {
    size: ['small', 'medium'],
  },
  baseProps: {
    label: 'Label',
    description: 'Format: MMM dd yyyy',
  },
});

createInteractiveVisualTests({
  componentName: 'DateField',
  renderComponent: (props) => (
    <DateField {...props} defaultValue={dateValue} />
  ),
  testId: 'test-date-field',
  variants,
  states: ['default', 'hover', 'focus', 'disabled'],
});

// ---------------------------------------------------------------------------
// Scenario tests — configuration variants
// ---------------------------------------------------------------------------

createVisualTestScenarios('DateField', [
  {
    name: 'numeric month',
    render: () => (
      <DateField
        size='medium'
        label='Label'
        description='Format: mm dd yyyy'
        shortMonth={false}
        defaultValue={dateValue}
      />
    ),
    screenshotName: 'date-field-numeric-month.png',
    className: 'inline-block p-s',
  },
  {
    name: 'datetime granularity',
    render: () => (
      <DateField
        size='medium'
        label='Label'
        description='Format: MMM dd yyyy hh:mm:ss'
        granularity='second'
        defaultValue={dateTimeValue}
      />
    ),
    screenshotName: 'date-field-datetime.png',
    className: 'inline-block p-s',
  },
  {
    name: 'readonly (medium)',
    render: () => (
      <DateField
        size='medium'
        label='Label'
        description='Format: MMM dd yyyy hh:mm:ss'
        granularity='second'
        isReadOnly
        defaultValue={dateTimeValue}
      />
    ),
    screenshotName: 'date-field-readonly-medium.png',
    className: 'inline-block p-s',
  },
  {
    name: 'invalid with error',
    render: () => (
      <DateField
        size='medium'
        label='Label'
        isInvalid
        errorMessage='Date is out of range'
        defaultValue={dateValue}
      />
    ),
    screenshotName: 'date-field-invalid.png',
    className: 'inline-block p-s',
  },
  {
    name: 'empty placeholder',
    render: () => (
      <DateField
        size='medium'
        label='Label'
        description='Format: MMM dd yyyy'
      />
    ),
    screenshotName: 'date-field-placeholder.png',
    className: 'inline-block p-s',
  },
  {
    name: 'readonly (small)',
    render: () => (
      <DateField
        size='small'
        granularity='second'
        isReadOnly
        defaultValue={dateTimeValue}
      />
    ),
    screenshotName: 'date-field-readonly-small.png',
    className: 'inline-block p-s',
  },
  {
    name: 'invalid (small)',
    render: () => (
      <DateField
        size='small'
        isInvalid
        errorMessage='Date is out of range'
        defaultValue={dateValue}
      />
    ),
    screenshotName: 'date-field-invalid-small.png',
    className: 'inline-block p-s',
  },
]);
