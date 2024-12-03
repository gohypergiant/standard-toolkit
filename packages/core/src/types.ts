export type Accumulator<T, R> = (acc: R, x: T) => R;

export type ArrayElementType<T> = T extends (infer E)[] ? E : T;

export type Comparator<T> = (x: T) => boolean;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type ExplicitAny = any;

export type MapFn<T, R> = (x: T, idx?: number) => R;

export type Predicate<T> = (x: T, idx?: number) => boolean;

export type UnaryFunction = (x: ExplicitAny) => ExplicitAny;
