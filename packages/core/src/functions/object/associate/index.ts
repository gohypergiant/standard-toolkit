export const associate =
  <T>(obj: T) =>
  <K extends keyof T = keyof T>(prop: K) =>
  (val: T[K]): T => ({ ...obj, [prop]: val });

export const assoc = associate;

export const associateDeep =
  <T>(obj: T) =>
  <K extends keyof T>(prop: K) =>
  (val: T[K]): T => {
    const x = structuredClone(obj);

    x[prop] = val;

    return x;
  };

export const assocDeep = associateDeep;
