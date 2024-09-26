/** Nullish Coalescing `(a ?? b)` */
export const nullishOr =
  <A>(a: A) =>
  <B>(b: B) =>
    a ?? b;

/** Nullish Coalescing `(a(x) ?? b(x))` */
export const nullishOrFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    a(c) ?? b(c);

/** Swapped Nullish Coalescing: `b ?? a` */
export const swappedNullishOr =
  <A>(a: A) =>
  <B>(b: B) =>
    b ?? a;

/** Swapped Nullish Coalescing: `b(x) ?? a(x)` */
export const swappedNullishOrFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    b(c) ?? a(c);
