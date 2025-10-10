import { describe, expectTypeOf, it } from 'vitest';
import { getSafeEnumValues } from './index';
import type { SafeEnum } from '../safe-enum';

describe('getSafeEnumValues', () => {
  it('should return the values of a safe enum', () => {
    const StringEnum = {
      valueOne: 'valueOne',
      valueTwo: 'valueTwo',
    } as const;

    type StringEnum = SafeEnum<typeof StringEnum>;

    const stringEnumValues = getSafeEnumValues(StringEnum);

    type StringEnumValues = readonly [StringEnum, ...StringEnum[]];

    expectTypeOf(stringEnumValues).toEqualTypeOf<StringEnumValues>();
  });

  it('should fail if enum is not a safe enum', () => {
    const NotConstantEnum = {
      valueOne: 'valueOne',
      valueTwo: 'valueTwo',
    };

    type NotConstantEnumManual = 'valueOne' | 'valueTwo';

    const notConstantEnumValues = getSafeEnumValues(NotConstantEnum);

    type NotConstantEnumValues = readonly [
      NotConstantEnumManual,
      ...NotConstantEnumManual[],
    ];

    expectTypeOf(
      notConstantEnumValues,
    ).not.toEqualTypeOf<NotConstantEnumValues>();
  });
});
