import type { RuleType } from 'react-querybuilder';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { getValidationResult } from './utils';

describe('queryBuilder/utils', () => {
  describe('getValidationResult', () => {
    const baseRule = {
      field: 'TEST_FIELD',
      id: '123abc',
      operator: 'equals',
      value: '100',
    };

    const numValidatorMultiValue = (r: RuleType) => ({
      valid: z
        .union([
          z.coerce.number().int().lte(10),
          z.tuple([
            z.coerce.number().int().lte(10),
            z.coerce.number().int().lte(10),
          ]),
        ])
        .safeParse(r.value).success,
      reasons: ['Number must be in range.'],
    });

    it('should return valid if no validator provided', () => {
      const result = getValidationResult(baseRule);

      expect(result.valid).toBe(true);
      expect(result.reasons).toBeUndefined();
    });

    it('should return valid if validator passes', () => {
      const result = getValidationResult(
        {
          ...baseRule,
          value: 'foo',
        },
        (r: RuleType) => ({
          valid: z.string().min(1).safeParse(r.value).success,
          reasons: ['At least one character is required.'],
        }),
      );

      expect(result.valid).toBe(true);
      expect(result.reasons?.length).toEqual(0);
    });

    it('should return invalid if validator fails', () => {
      const result = getValidationResult(
        {
          ...baseRule,
          value: '',
        },
        (r: RuleType) => ({
          valid: z.string().min(1).safeParse(r.value).success,
          reasons: ['At least one character is required.'],
        }),
      );

      expect(result.valid).toBe(false);
      expect(result.reasons?.length).toEqual(1);
      expect(result.reasons).toStrictEqual([
        'At least one character is required.',
      ]);
    });

    it('multi-value validation fails if one value fails', () => {
      const rule = {
        ...baseRule,
        operator: 'between',
        value: ['1', '15'],
      };

      const result = getValidationResult(rule, numValidatorMultiValue);

      expect(result.valid).toBe(false);
      expect(result.reasons).toStrictEqual(['Number must be in range.']);
    });

    it('multi-value validation fails if both values fail', () => {
      const rule = {
        ...baseRule,
        operator: 'between',
        value: ['15', '15'],
      };

      const result = getValidationResult(rule, numValidatorMultiValue);

      expect(result.valid).toBe(false);
      expect(result.reasons).toStrictEqual(['Number must be in range.']);
    });

    it('multi-value passes if both values pass', () => {
      const rule = {
        ...baseRule,
        operator: 'between',
        value: ['5', '5'],
      };

      const result = getValidationResult(rule, numValidatorMultiValue);

      expect(result.valid).toBe(true);
      expect(result.reasons?.length).toEqual(0);
    });

    it('multi-value evaluates empty values', () => {
      const result = getValidationResult(
        {
          ...baseRule,
          operator: 'between',
          value: ['foo', ''],
        },
        (r: RuleType) => ({
          valid: z
            .union([
              z.string().min(1),
              z.tuple([z.string().min(1), z.string().min(1)]),
            ])
            .safeParse(r.value).success,
          reasons: ['At least one character is required.'],
        }),
      );

      expect(result.valid).toBe(false);
      expect(result.reasons).toStrictEqual([
        'At least one character is required.',
      ]);
    });
  });
});
