export const indexOf =
  <T>(x: T) =>
  <C extends T[]>(arr: C) => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (arr[i] === x) {
        // should probably be a better equal() fn call
        return i;
      }
    }

    return -1;
  };
