export const push =
  <T extends unknown[]>(arr: T) =>
  (x: T[number]) => {
    const len = arr.length;
    const res = new Array(len + 1) as T;

    for (let i = 0; i < len; i++) {
      res[i] = arr[i];
    }

    res[len] = x;

    return res;
  };

