export const reverse = <T extends unknown[]>(arr: T) => {
  const len = arr.length;
  const res = new Array(len) as T;

  for (let i = len - 1; i >= 0; i--) {
    res[len - i - 1] = arr[i];
  }

  return res;
};

