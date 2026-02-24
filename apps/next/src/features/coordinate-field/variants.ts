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

import type {
  CoordinateFieldProps,
  CoordinateValue,
} from '@accelint/design-toolkit/components/coordinate-field/types';

export type CoordinateFieldVariant = Pick<
  CoordinateFieldProps,
  | 'description'
  | 'format'
  | 'size'
  | 'variant'
  | 'showFormatButton'
  | 'isDisabled'
  | 'isReadOnly'
  | 'isInvalid'
  | 'isRequired'
  | 'errorMessage'
  | 'value'
  | 'label'
>;

export const NYC_COORDS: CoordinateValue = { lat: 40.7128, lon: -74.006 };

export const FORMAT_SCENARIOS: CoordinateFieldVariant[] = [
  { format: 'dd', label: 'DD Empty' },
  { format: 'dd', label: 'DD Filled', value: NYC_COORDS },
  { format: 'ddm', label: 'DDM Empty' },
  { format: 'ddm', label: 'DDM Filled', value: NYC_COORDS },
  { format: 'dms', label: 'DMS Empty' },
  { format: 'dms', label: 'DMS Filled', value: NYC_COORDS },
  { format: 'mgrs', label: 'MGRS Empty' },
  { format: 'mgrs', label: 'MGRS Filled', value: NYC_COORDS },
  { format: 'utm', label: 'UTM Empty' },
  { format: 'utm', label: 'UTM Filled', value: NYC_COORDS },
];

export const SIZE_SCENARIOS: CoordinateFieldVariant[] = [
  { format: 'dms', size: 'small', label: 'Small DMS', value: NYC_COORDS },
  { format: 'dms', size: 'medium', label: 'Medium DMS', value: NYC_COORDS },
];

export const LAYOUT_SCENARIOS: CoordinateFieldVariant[] = [
  {
    format: 'dms',
    variant: 'inline',
    label: 'Inline DMS',
    value: NYC_COORDS,
  },
  {
    format: 'dms',
    variant: 'stacked',
    label: 'Stacked DMS',
    value: NYC_COORDS,
  },
];

export const STATE_SCENARIOS: CoordinateFieldVariant[] = [
  {
    format: 'dd',
    isDisabled: true,
    label: 'Disabled',
    value: NYC_COORDS,
  },
  {
    format: 'dd',
    isReadOnly: true,
    label: 'Read Only',
    value: NYC_COORDS,
  },
  {
    format: 'dd',
    isInvalid: true,
    errorMessage: 'Invalid coordinates',
    label: 'Invalid',
    value: NYC_COORDS,
  },
  {
    format: 'dd',
    isRequired: true,
    label: 'Required',
  },
];

export const DESCRIPTION_SCENARIOS: CoordinateFieldVariant[] = [
  {
    format: 'dd',
    label: 'With Description',
    description: 'Enter coordinates in Decimal Degrees',
    value: NYC_COORDS,
  },
  {
    format: 'dd',
    label: 'Description Hidden When Invalid',
    description: 'This should not be visible',
    isInvalid: true,
    errorMessage: 'Invalid coordinates',
    value: NYC_COORDS,
  },
];

export const FORMAT_BUTTON_SCENARIOS: CoordinateFieldVariant[] = [
  {
    format: 'dd',
    showFormatButton: true,
    label: 'With Format Button',
    value: NYC_COORDS,
  },
  {
    format: 'dd',
    showFormatButton: false,
    label: 'Without Format Button',
    value: NYC_COORDS,
  },
];

export const COPY_MENU_SCENARIOS: CoordinateFieldVariant[] = [
  { format: 'dd', label: 'Copy Menu DD', value: NYC_COORDS },
  { format: 'dms', label: 'Copy Menu DMS', value: NYC_COORDS },
];
