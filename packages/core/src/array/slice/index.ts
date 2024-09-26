export const slice =
  (x: number) =>
  (y: number) =>
  <T extends unknown[]>(arr: T) => {
    const minY = Math.min(y, arr.length);
    const res = new Array(minY - x) as T;

    for (let i = x; i < minY; i++) {
      res[i - x] = arr[i];
    }

    return res;
  };

