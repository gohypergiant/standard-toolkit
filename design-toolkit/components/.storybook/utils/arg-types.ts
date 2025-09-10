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

import { CLASSIFICATION_VALUES } from '@/constants/classifications';
import { CRITICALITY_VALUES } from '@/constants/criticality-variants';
import { SIZE_RANGES } from '@/constants/size-variants';
import {
  createArgTypeBool,
  createArgTypeSelect,
  createArgTypeText,
} from './create-arg-types';

/**
 * Configurations for common argTypes
 */
export const COMMON_ARG_TYPES = {
  autoFocus: createArgTypeBool(
    'Whether the component should automatically receive focus',
  ),

  children: createArgTypeText(
    'Content to be displayed inside the component',
    'ReactNode',
  ),

  classificationVariant: createArgTypeSelect(
    'Security classification level with appropriate colors and default text',
    CLASSIFICATION_VALUES,
    'missing',
  ),

  criticality: createArgTypeSelect(
    'Color variant indicating different levels of importance',
    CRITICALITY_VALUES,
    'info',
  ),

  description: createArgTypeText(
    'Descriptive text to provide additional context',
  ),

  errorMessage: createArgTypeText(
    'Error message to display when validation fails',
  ),

  isDisabled: createArgTypeBool('Whether the component is disabled'),

  isRequired: createArgTypeBool('Whether the component is required'),

  isInvalid: createArgTypeBool('Whether the component is in an invalid state'),

  isLoading: createArgTypeBool('Whether the component is in a loading state'),

  isReadOnly: createArgTypeBool('Whether the component is read-only'),

  label: createArgTypeText('Text label for the component'),

  orientation: createArgTypeSelect('Layout orientation of the component', [
    'horizontal',
    'vertical',
  ]),

  placeholder: createArgTypeText(
    'Placeholder text shown when the input is empty',
  ),

  placement: createArgTypeSelect(
    'Position of the component relative to its trigger',
    ['top', 'bottom', 'left', 'right'],
    'bottom',
  ),

  selectionMode: createArgTypeSelect('Selection behavior for the component', [
    'none',
    'single',
    'multiple',
  ]),

  size: {
    binary: createArgTypeSelect(
      'Size variant of the component',
      SIZE_RANGES.BINARY,
    ),
    compact: createArgTypeSelect(
      'Size variant of the component',
      SIZE_RANGES.COMPACT,
    ),
    full: createArgTypeSelect(
      'Size variant of the component',
      SIZE_RANGES.FULL,
    ),
    standard: createArgTypeSelect(
      'Size variant of the component',
      SIZE_RANGES.STANDARD,
    ),
  },

  // Spacing/Layout variants
  spacingVariant: createArgTypeSelect('Component spacing density', [
    'cozy',
    'compact',
  ]),

  value: createArgTypeText('Current value of the component'),
};
