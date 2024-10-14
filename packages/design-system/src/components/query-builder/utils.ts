import { noop } from 'lodash';
import type { MouseEvent } from 'react';
import type { PressEvent } from 'react-aria';
import type {
  RuleType,
  RuleValidator,
  ValidationResult,
} from 'react-querybuilder';

/**
 * This is required because the C2DS Button supports an onPress event but
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
