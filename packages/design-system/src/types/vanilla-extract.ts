import type { createVar } from '@vanilla-extract/css';

/**
 * Re-export due to not being exported by library
 */

export type CssVarFunction = ReturnType<typeof createVar>;

export type Contract = {
  [key: string]: CssVarFunction | null | Contract;
};

export type Primitive = string | boolean | number | null | undefined;

export type MapLeafNodes<Obj, LeafType> = {
  [Prop in keyof Obj]: Obj[Prop] extends Primitive
    ? LeafType
    : Obj[Prop] extends Record<string | number, unknown>
      ? MapLeafNodes<Obj[Prop], LeafType>
      : never;
};

export type PartialMapLeafNodes<Obj, LeafType> = {
  [Prop in keyof Obj]?: Obj[Prop] extends Primitive
    ? LeafType
    : Obj[Prop] extends Record<string | number, unknown>
      ? PartialMapLeafNodes<Obj[Prop], LeafType>
      : never;
};
