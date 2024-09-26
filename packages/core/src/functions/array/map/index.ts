export const map =
  <T, R>(map: (x: T, idx?: number) => R) =>
  <C extends T[]>(arr: C) => {
    const len = arr.length;
    const res: R[] = new Array(len);

    for (let i = 0; i < len; i++) {
      res[i] = map(arr[i], i);
    }

    return res;
  };

