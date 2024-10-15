// Converts interface to type which gets around the pesky lack of index signature issue
export type AsType<T> = T extends object ? { [Key in keyof T]: T[Key] } : T;
