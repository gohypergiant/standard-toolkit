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

import { AXIS } from '@/constants/axis';
import { CLASSIFICATION } from '@/constants/classification';
import { CRITICALITY } from '@/constants/criticality';
import { PLACEMENT } from '@/constants/placement';
import { SELECTION } from '@/constants/selection';
import { SIZE_RANGE } from '@/constants/size';
import { createControl } from './create-control';

/**
 * Configurations for common argTypes
 */
export const COMMON_CONTROL = {
  autoFocus: createControl.boolean(
    'Whether the component should automatically receive focus',
  ),

  children: createControl.text(
    'Content to be displayed inside the component',
    'ReactNode',
  ),

  classificationVariant: createControl.select(
    'Security classification level with appropriate colors and default text',
    Object.values(CLASSIFICATION),
    'missing',
  ),

  criticality: createControl.select(
    'Color variant indicating different levels of importance',
    Object.values(CRITICALITY),
    'info',
  ),

  description: createControl.text(
    'Descriptive text to provide additional context',
  ),

  errorMessage: createControl.text(
    'Error message to display when validation fails',
  ),

  isDisabled: createControl.boolean('Whether the component is disabled'),

  isRequired: createControl.boolean('Whether the component is required'),

  isInvalid: createControl.boolean(
    'Whether the component is in an invalid state',
  ),

  isLoading: createControl.boolean(
    'Whether the component is in a loading state',
  ),

  isReadOnly: createControl.boolean('Whether the component is read-only'),

  label: createControl.text('Text label for the component'),

  orientation: createControl.radio(
    'Layout orientation of the component',
    Object.values(AXIS),
  ),

  placeholder: createControl.text(
    'Placeholder text shown when the input is empty',
  ),

  placement: createControl.select(
    'Position of the component relative to its trigger',
    Object.values(PLACEMENT),
    PLACEMENT.BOTTOM,
  ),

  selectionMode: createControl.select(
    'Selection behavior for the component',
    Object.values(SELECTION),
  ),

  size: {
    binary: createControl.select(
      'Size variant of the component',
      SIZE_RANGE.BINARY,
    ),
    compact: createControl.select(
      'Size variant of the component',
      SIZE_RANGE.COMPACT,
    ),
    full: createControl.select(
      'Size variant of the component',
      SIZE_RANGE.FULL,
    ),
    standard: createControl.select(
      'Size variant of the component',
      SIZE_RANGE.STANDARD,
    ),
  },

  // Spacing/Layout variants
  spacingVariant: createControl.select('Component spacing density', [
    'cozy',
    'compact',
  ]),

  value: createControl.text('Current value of the component'),
};
