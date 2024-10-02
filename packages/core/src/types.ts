export type UnaryFunction = (x: any) => any;

export type ArrayElementType<T> = T extends (infer E)[] ? E : T;

export type Comparator<T> = (x: T) => boolean;

export type Predicate<T> = (x: T, idx?: number) => boolean;

export type Accumulator<T, R> = (acc: R, x: T) => R;

export type MapFn<T, R> = (x: T, idx?: number) => R;
