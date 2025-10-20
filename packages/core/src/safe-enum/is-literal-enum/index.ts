/**
 * Checks that all values for an enum are of a singular primitive and is readonly.
 *
 * @internal
 */
type IsLiteralEnumForPrimitive<TObject, TPrimitive> = TObject extends Record<
  string,
  TPrimitive
>
  ? keyof TObject extends string
    ? TObject[keyof TObject] extends TPrimitive
      ? TPrimitive extends TObject[keyof TObject]
        ? false
        : true
      : false
    : false
  : false;

/**
 * Check that an enum contains values that are only strings or number and values are readonly.
 *
 * @internal
 */
export type IsLiteralEnum<TObject> = IsLiteralEnumForPrimitive<
  TObject,
  string
> extends false
  ? IsLiteralEnumForPrimitive<TObject, number>
  : true;
