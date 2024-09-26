export const shift = <T extends unknown[]>(arr: T): [T[number], T] => {
  const len = arr.length;
  const tail = new Array(len - 1) as T;

  const head = arr[0];

  for (let i = 1; i < len; i++) {
    tail[i - 1] = arr[i];
  }

  return [head, tail];
};

