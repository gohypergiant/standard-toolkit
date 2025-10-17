import { getSafeEnumValues, type SafeEnum } from "@accelint/core";

export const SortDirection = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
} as const);

export const HeaderColumnAction = Object.freeze({
    NUMERAL: 'numeral',
    KEBAB: 'kebab',
    SELECTION: 'selection'
} as const);

export type SortDirectionState = SafeEnum<typeof SortDirection>;
export const sortDirectionValues = getSafeEnumValues(SortDirection);

export type HeaderColumnActionKey = SafeEnum<typeof HeaderColumnAction>;
export const headerColumnActionValues = getSafeEnumValues(HeaderColumnAction);