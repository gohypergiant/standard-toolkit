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

import {
  CRITICALITY_VARIANTS,
  type CriticalityVariant,
} from '@/constants/criticality-variants';
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
  ARIA_INTERNAL: ['slot', 'validationBehavior', 'validationErrors'],

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
 * Standard control types for consistent UI patterns
 */
export const STANDARD_CONTROLS = {
  /**
   * Standard size variants - sourced from shared constants
   * Use SIZE_RANGES for component-specific size options:
   * - FULL: ['xsmall', 'small', 'medium', 'large'] for Button, Icon
   * - COMPACT: ['small', 'medium'] for form fields
   * - STANDARD: ['small', 'medium', 'large'] for most components
   * - BINARY: ['small', 'large'] for simple size toggles
   */
  SIZE: {
    control: { type: 'select' as const },
    options: SIZE_RANGES.FULL, // Default to full range, override per component
  },

  VARIANT: {
    control: { type: 'select' as const },
    // Options should be defined per component
  },

  /**
   * Semantic criticality variants - sourced from shared constants
   * These represent the standard criticality levels used across the design system:
   * - normal: Green styling for normal/success content
   * - info: Blue styling for informational content
   * - advisory: Yellow styling for advisory/warning content
   * - serious: Orange styling for serious issues
   * - critical: Red styling for critical errors or alerts
   */
  COLOR: {
    control: { type: 'select' as const },
    options: Object.values(CRITICALITY_VARIANTS) satisfies CriticalityVariant[],
  },

  BOOLEAN: {
    control: { type: 'boolean' as const },
    table: { type: { summary: 'boolean' } },
  },
};

/**
 * Helper to create size controls for specific component types
 */
export const createSizeControl = (range: keyof typeof SIZE_RANGES) => {
  const options = SIZE_RANGES[range];
  const defaultSize = options.includes('medium' as any) ? 'medium' : options[0];

  return {
    control: { type: 'select' as const },
    options,
    table: {
      type: { summary: options.join(' | ') },
      defaultValue: { summary: defaultSize },
    },
  };
};

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
