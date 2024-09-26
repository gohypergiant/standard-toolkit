export const unshift =
  <T extends unknown[]>(arr: T) =>
  (x: T[number]) => {
    const len = arr.length;
    const res = new Array(len + 1) as T;

    res[0] = x;

    for (let i = 0; i < len; i++) {
      res[i + 1] = arr[i];
    }

    return res;
  };

