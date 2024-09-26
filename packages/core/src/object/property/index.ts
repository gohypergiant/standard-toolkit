// TODO: If type of result === Obj or Arr, clone response
// TODO: Also need to make a "path" or something that drills down

// This really should be (prop)(object) but currying breaks TS because TS is SOOOO great

// const property =
//   <T extends {}>(obj: T) =>
//   <K extends keyof T>(prop: K) =>
//     obj[prop];

export const property =
  <T>(obj: T) =>
  <K extends keyof T>(prop: K): T[K] => {
    return Array.isArray(obj) &&
      Number.isFinite(Number.parseInt(prop as string, 10))
      ? obj.at(Number.parseInt(prop as string, 10))
      : obj[prop];
  };

export const prop = property;

export const optionalProperty =
  <T>(obj?: T) =>
  <K extends keyof T>(prop: K): T[K] | undefined => {
    return Array.isArray(obj) &&
      Number.isFinite(Number.parseInt(prop as string, 10))
      ? obj.at(Number.parseInt(prop as string, 10))
      : obj?.[prop];
  };

export const optionalProp = optionalProperty;
