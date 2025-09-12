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

/**
 * Common control exclusions to reduce noise in Storybook controls panel
 */
export const COMMON_CONTROL_EXCLUSIONS = {
  // React Aria form-related props that create visual noise
  FORM_PROPS: [
    'form',
    'formAction',
    'formEncType',
    'formMethod',
    'formNoValidate',
    'formTarget',
    'name',
    'value',
  ],

  // React internal props
  REACT_PROPS: ['children', 'key', 'ref'],

  // React Aria internal props
  ARIA_INTERNAL: [
    'slot',
    'validationBehavior',
    'validationErrors',
    'elementType',
  ],

  // Layout/styling props that are better controlled via code
  STYLING_PROPS: ['className', 'classNames', 'style'],

  // Event handlers (keep only the most relevant for interaction testing)
  EVENT_HANDLERS: [
    'onFocus',
    'onBlur',
    'onKeyDown',
    'onKeyUp',
    'onMouseEnter',
    'onMouseLeave',
  ],
};

/**
 * Helper to create size controls for specific component types
 */
export const createSizeControl = (range: keyof typeof SIZE_RANGES) => {
  const options = SIZE_RANGES[range];
  const defaultSize = options.find((item) => item === 'medium') ?? options[0];

  return {
    control: { type: 'select' as const },
    options,
    description: 'Size variant of the component',
    table: {
      type: { summary: options.join(' | ') },
      defaultValue: { summary: defaultSize },
    },
  };
};

/**
 * Helper to create variant controls with consistent options
 */
export const createVariantControl = (options: readonly string[]) => ({
  control: { type: 'select' as const },
  options: [...options],
  description: 'Visual variant of the component',
  table: {
    type: { summary: options.join(' | ') },
    defaultValue: { summary: options[0] },
  },
});

/**
 * Helper to create consistent parameters for different component types
 */
export const createStandardParameters = (
  type: 'form' | 'overlay' | 'container' | 'content',
) => {
  const baseParams = {
    controls: {
      exclude: [
        ...COMMON_CONTROL_EXCLUSIONS.REACT_PROPS,
        ...COMMON_CONTROL_EXCLUSIONS.ARIA_INTERNAL,
        ...COMMON_CONTROL_EXCLUSIONS.STYLING_PROPS,
        ...COMMON_CONTROL_EXCLUSIONS.EVENT_HANDLERS,
      ],
    },
  };

  switch (type) {
    case 'form':
      return {
        ...baseParams,
        controls: {
          ...baseParams.controls,
          exclude: [
            ...baseParams.controls.exclude,
            ...COMMON_CONTROL_EXCLUSIONS.FORM_PROPS,
          ],
        },
      };

    case 'overlay':
      return {
        ...baseParams,
        layout: 'fullscreen',
        controls: {
          ...baseParams.controls,
          exclude: [
            ...baseParams.controls.exclude,
            'parentRef',
            'isDismissable',
            'isKeyboardDismissDisabled',
          ],
        },
      };

    case 'container':
      return {
        ...baseParams,
        layout: 'padded',
      };

    default:
      return baseParams;
  }
};

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
