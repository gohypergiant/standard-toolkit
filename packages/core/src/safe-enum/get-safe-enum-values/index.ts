import type { IsLiteralEnum } from '../is-literal-enum';
import type { SafeEnum } from '../safe-enum';
import type { ValidEnumStructures } from '../valid-enum-structures';

/**
 * Gets the values from a SafeEnum and properly types them.
 *
 * @param safeEnum The enum to extract the values from.
 */
export function getSafeEnumValues<
  TSafeEnum extends ValidEnumStructures,
  TSafeEnumValues = SafeEnum<TSafeEnum>,
  TSafeEnumReturnValues = IsLiteralEnum<TSafeEnum> extends true
    ? readonly [TSafeEnumValues, ...TSafeEnumValues[]]
    : TSafeEnumValues,
>(safeEnum: TSafeEnum) {
  return Object.freeze(Object.values(safeEnum)) as TSafeEnumReturnValues;
}
