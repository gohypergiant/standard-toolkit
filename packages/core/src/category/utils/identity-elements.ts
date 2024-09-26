// ? https://mathworld.wolfram.com/IdentityElement.html
// ? The identity element `I` (also denoted `E`, `e`, or `1`) of a group or related
// ? mathematical structure `S` is the unique element such that `Ia = aI = a` for
// ? every element `a` in `S`. The symbol "E" derives from the German word for unity,
// ? "Einheit." An identity element is also called a unit element.

/**
 * An Identity element is an element of a set which, if combined
 * with another element by a specified binary operation, leaves
 * that element unchanged.
 */
export const IDENTITY_ELEMENTS = {
  Null: null,
  Undefined: undefined,
  String: '',
  Additive: 0,
  Multiplicative: 1,
  Boolean: false,
  Array: [],
  Object: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  Function: () => {},
};
