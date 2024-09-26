// ^ ***********************************************************************
// ^ MATHEMATICAL OBJECT
// ^ ***********************************************************************

// ^--------------------------------------
// ^---------- Math Object Type ----------
// ^--------------------------------------

/**
 * @example
 * 𝑂𝑏𝑗𝑒𝑐𝑡 a
 */
export interface MathObj_<T> {
  readonly __value: T;

  // Not strictly spec but makes checks easier then `typeof X -> object`

  /** Name of type */
  readonly name: string;

  /** Name and value of type */
  inspect(): string;
}

// ^------------------------------------------
// ^---------- Concrete Math Object ----------
// ^------------------------------------------

/**
 * A mathematical object is just a plain {} containing a single value.
 *
 * @example
 * 𝑂𝑏𝑗𝑒𝑐𝑡 a
 */
export const MathObj = <T>(v: T): MathObj_<T> => ({
  name: 'MathObj',
  __value: v,

  inspect() {
    return `Math Object(${this.__value})`;
  },
});
