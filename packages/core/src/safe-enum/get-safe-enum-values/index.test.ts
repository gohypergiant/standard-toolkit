import { describe, expect, it } from 'vitest';
import { getSafeEnumValues } from '.';

describe('getSafeEnumValues', () => {
  it('should return the values of a safe enum', () => {
    const StringEnum = {
      valueOne: 'valueOne',
      valueTwo: 'valueTwo',
    } as const;

    const stringEnumValues = getSafeEnumValues(StringEnum);

    expect(stringEnumValues).toEqual([
      StringEnum.valueOne,
      StringEnum.valueTwo,
    ]);
  });
});
