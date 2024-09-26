export type FamiliarAliases<T> = {
  /** Alias for `chain()` that most JS devs would be familiar with */
  then<R>(
    fn: (x: T) => R
  ): R extends FamiliarAliases<infer R>
    ? FamiliarAliases<R>
    : FamiliarAliases<R>;

  /** Alias for `of()` that would be slightly more familiar */
  resolve<T>(a: T): FamiliarAliases<T>;

  /** Alias for `of()` */
  from<T>(a: T): FamiliarAliases<T>;
};

// ^ TODO: Make and put these in a types/ package
export type UnaryFunction<A, B> = (x: A) => B;
export type Predicate<T> = (x: T, idx?: number) => boolean;
