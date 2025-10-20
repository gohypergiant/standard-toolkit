import { describe, expectTypeOf, it } from 'vitest';
import type { IsLiteralEnum } from '.';

describe('IsLiteralEnum', () => {
  it('should pass when string enum', () => {
    const StringEnum = {
      valueOne: 'valueOne',
      valueTwo: 'valueTwo',
    } as const;

    const test: IsLiteralEnum<typeof StringEnum> = true;

    expectTypeOf(test).toMatchTypeOf(true);
  });

  it('should pass when number enum', () => {
    const NumEnum = {
      valueOne: 1,
      valueTwo: 2,
    } as const;

    const test: IsLiteralEnum<typeof NumEnum> = true;

    expectTypeOf(test).toMatchTypeOf(true);
  });

  it('should fail when mixed enum', () => {
    const MixedEnum = {
      valueOne: 1,
      valueTwo: 'two',
    } as const;

    const test: IsLiteralEnum<typeof MixedEnum> = false;

    expectTypeOf(test).toMatchTypeOf(false);
  });

  it('should fail when not a const enum', () => {
    const NonConstantEnum = {
      valueOne: 1,
      valueTwo: 2,
    };

    const test: IsLiteralEnum<typeof NonConstantEnum> = false;

    expectTypeOf(test).toMatchTypeOf(false);
  });
});
