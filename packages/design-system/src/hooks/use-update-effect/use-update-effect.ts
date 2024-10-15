import { useEffect, useRef } from 'react';

function useIsFirstMount(): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
}

export function useUpdateEffect(effect: () => void, deps: any) {
  const isFirstMount = useIsFirstMount();

  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
  }, deps);
}
