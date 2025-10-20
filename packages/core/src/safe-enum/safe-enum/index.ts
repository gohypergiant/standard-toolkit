import type { IsLiteralEnum } from '../is-literal-enum';
import type { ValidEnumStructures } from '../valid-enum-structures';

/**
 * An alternative to TypeScript `enums` that is safe and compatible.
 *
 * To use make an object and add `as const` to the end of the object. It is recommended to wrap the object in
 * `Object.freeze` but it is not required. Pass the object to `SafeEnum` and export both the enum and the type, TS will
 * automatically use the enum when using it in code and the type when using it for type reference.
 *
 * @example
 *  import { SafeEnum } from '@accelint-private/core/safe-enum'
 *
 *  export const MyEnum = Object.freeze({
 *    Better: 'better',
 *    Safer: 'safer',
 *    Compatible: 'compatible',
 *  } as const);
 *
 *  export type MyEnum = SafeEnum<typeof MyEnum>;
 *
 *  const defaultValue: MyEnum = MyEnum.Better;
 *
 * @see https://dev.to/ivanzm123/dont-use-enums-in-typescript-they-are-very-dangerous-57bh
 */
export type SafeEnum<TObject extends ValidEnumStructures> =
  IsLiteralEnum<TObject> extends true
    ? TObject[keyof TObject]
    : '[SafeEnum Error] Enum is not `as const` or has mixed values, check that you created the enum properly.';
