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

type Layout = 'centered' | 'fullscreen' | 'padded';

const EXCLUSIONS = {
  // Layout/styling props that are better controlled via code
  CONTAINED: ['parentRef', 'isDismissable', 'isKeyboardDismissDisabled'],

  // React Aria form-related props that create visual noise
  FORM: [
    'form',
    'formAction',
    'formEncType',
    'formMethod',
    'formNoValidate',
    'formTarget',
    'inputProps',
    'inputRef', // ?
    'name',
    'value',
  ],
};

/**
 * Creates Storybook parameters with standardized control exclusions and layout settings.
 *
 * This utility function helps configure Storybook stories by excluding common props that
 * create visual noise in the controls panel while maintaining focus on the most relevant
 * interactive properties for component testing and documentation.
 *
 * @param layout - The layout mode for the story ('centered' | 'fullscreen' | 'padded')
 * @param exclusions - Props to exclude from Storybook controls. Can be:
 *   - Keys from the EXCLUSIONS object ('CONTAINED' | 'FORM') to exclude predefined prop groups
 *   - Individual prop names as strings to exclude specific argTypes
 *   - Mix of both
 *
 * @example
 * ```typescript
 * // Basic usage with layout only
 * export default {
 *   parameters: createParameters('centered'),
 * };
 *
 * // Exclude form-related props using predefined group
 * export default {
 *   parameters: createParameters('padded', 'FORM'),
 * };
 *
 * // Exclude specific individual props
 * export default {
 *   parameters: createParameters('centered', 'onSubmit', 'disabled'),
 * };
 *
 * // Mix predefined groups and individual props
 * export default {
 *   parameters: createParameters('fullscreen', 'CONTAINED', 'FORM', 'customProp'),
 * };
 * ```
 *
 * @returns Storybook parameters object with controls.exclude array and layout setting
 */
export const createParameters = (
  layout: Layout,
  ...exclusions: (keyof typeof EXCLUSIONS)[] | string[]
) => ({
  controls: {
    exclude: [
      'children',

      // React Aria internal props
      'slot',
      'validationBehavior',
      'validationErrors',
      'elementType',

      // Event handlers (keep only the most relevant for interaction testing)
      'onFocus',
      'onBlur',
      'onKeyDown',
      'onKeyUp',
      'onMouseEnter',
      'onMouseLeave',

      // React internal props
      'key',
      'ref',

      // styling
      'className',
      'classNames',
      'style',

      ...exclusions.flatMap(
        (key) => EXCLUSIONS[key as keyof typeof EXCLUSIONS] ?? key,
      ),
    ].sort(),
  },
  layout,
});
