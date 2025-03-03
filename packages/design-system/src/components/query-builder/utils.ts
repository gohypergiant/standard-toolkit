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

import { noop } from '@accelint/core';
import type { PressEvent } from '@react-types/shared';
import type { MouseEvent } from 'react';
import type {
  RuleType,
  RuleValidator,
  ValidationResult,
} from 'react-querybuilder';

/**
 * This is required because the design system Button supports an onPress event but
 * QueryBuilder provides a callback that expects a MouseEvent and will error
 * out if preventDefault is not available as a method.
 * @param event
 */
export const pressToMouseEvent = (event: PressEvent) =>
  ({
    ...event,
    preventDefault: noop,
    stopPropagation: noop,
  }) as unknown as MouseEvent;

/**
 * Validates according to the validator function
 *
 * For single-value rules (e.g. 5 is a number), validator function should provide a single conditional
 * const singleValidator = z.string().min(1);
 *
 * For multi-value rules (e.g. using operators such as "between" or "during), validator func can optionally
 * be a union conditional https://zod.dev/?id=unions to allow validation against either a single value or multiple.
 * Right and left validators in the tuple do not need to be the same.
 *
 * const multiValidator = z.union([
 *    singleValidator,
 *    z.tuple([singleValidator, singleValidator])
 * ])
 *
 * @param rule
 * @param validator
 */
export const getValidationResult = (
  rule: RuleType,
  validator?: RuleValidator,
): ValidationResult => {
  if (!validator) {
    return { valid: true };
  }

  const result = validator(rule);

  if (typeof result === 'boolean') {
    return { valid: result };
  }

  return {
    valid: result.valid,
    reasons: result.valid ? [] : result.reasons,
  };
};
