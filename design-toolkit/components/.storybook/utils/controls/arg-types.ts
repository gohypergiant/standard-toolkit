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

/**
 * Standard argType configurations for common props
 */
export const STANDARD_ARG_TYPES = {
  autoFocus: {
    control: { type: 'boolean' as const },
    description: 'Whether the component should automatically receive focus',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },

  children: {
    control: { type: 'text' as const },
    description: 'Content to be displayed inside the component',
    table: { type: { summary: 'ReactNode' } },
  },

  classificationVariant: {
    control: { type: 'select' as const },
    options: CLASSIFICATION_VALUES,
    description:
      'Security classification level with appropriate colors and default text',
    table: {
      type: { summary: CLASSIFICATION_VALUES.join(' | ') },
      defaultValue: { summary: 'missing' },
    },
  },

  criticality: {
    control: { type: 'select' as const },
    description: 'Color variant indicating different levels of importance',
    options: CRITICALITY_VALUES,
    table: {
      type: { summary: CRITICALITY_VALUES.join(' | ') },
      defaultValue: { summary: 'info' },
    },
  },

  description: {
    control: { type: 'text' as const },
    description: 'Descriptive text to provide additional context',
    table: { type: { summary: 'string' } },
  },

  errorMessage: {
    control: { type: 'text' as const },
    description: 'Error message to display when validation fails',
    table: { type: { summary: 'string' } },
  },

  isDisabled: {
    control: { type: 'boolean' as const },
    description: 'Whether the component is disabled',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },

  isRequired: {
    control: { type: 'boolean' as const },
    description: 'Whether the component is required',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },

  isInvalid: {
    control: { type: 'boolean' as const },
    description: 'Whether the component is in an invalid state',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },

  isLoading: {
    control: { type: 'boolean' as const },
    description: 'Whether the component is in a loading state',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },

  isReadOnly: {
    control: { type: 'boolean' as const },
    description: 'Whether the component is read-only',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },

  label: {
    control: { type: 'text' as const },
    description: 'Text label for the component',
    table: { type: { summary: 'string' } },
  },

  orientation: {
    control: { type: 'select' as const },
    options: ['horizontal', 'vertical'],
    description: 'Layout orientation of the component',
    table: {
      type: { summary: 'horizontal | vertical' },
      defaultValue: { summary: 'horizontal' },
    },
  },

  placeholder: {
    control: { type: 'text' as const },
    description: 'Placeholder text shown when the input is empty',
    table: { type: { summary: 'string' } },
  },

  placement: {
    control: { type: 'select' as const },
    options: ['top', 'bottom', 'left', 'right'],
    description: 'Position of the component relative to its trigger',
    table: {
      type: { summary: 'top | bottom | left | right' },
      defaultValue: { summary: 'bottom' },
    },
  },

  selectionMode: {
    control: { type: 'select' as const },
    options: ['none', 'single', 'multiple'],
    description: 'Selection behavior for the component',
    table: {
      type: { summary: 'none | single | multiple' },
      defaultValue: { summary: 'none' },
    },
  },

  value: {
    control: { type: 'text' as const },
    description: 'Current value of the component',
    table: { type: { summary: 'string' } },
  },
};
