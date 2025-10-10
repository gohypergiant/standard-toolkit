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

export const EXCLUSIONS = Object.freeze({
  COMMON: Object.freeze([
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
  ] as const),

  // Layout/styling props that are better controlled via code
  CONTAINED: Object.freeze([
    'parentRef',
    'isDismissable',
    'isKeyboardDismissDisabled',
  ] as const),

  // React Aria form-related props that create visual noise
  FORM: Object.freeze([
    'form',
    'formAction',
    'formEncType',
    'formMethod',
    'formNoValidate',
    'formTarget',
    'inputProps',
    'inputRef',
    'name',
    'value',
  ] as const),
} as const);
