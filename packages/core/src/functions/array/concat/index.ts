export const concat =
  <T extends unknown[]>(newValue: T) =>
  (concatable: T) =>
    concatable.concat(newValue) as T;
