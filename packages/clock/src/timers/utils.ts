// __private-exports

const SECOND = 1000;

export function remainder(interval: number) {
  return interval - (Date.now() % interval);
}

export function callNextSecond(callback: () => void) {
  const nextTick = remainder(SECOND);

  const timeout = setTimeout(() => {
    callback();
    clearTimeout(timeout);
  }, nextTick);
}
