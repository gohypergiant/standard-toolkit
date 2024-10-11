import {
  type RefCallback,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

/**
 * Detects whether a slot has been utilized
 *
 * Example:
 * Parent component implements RAC Provider, with a slotted context
 * Child component implements slot prop matching provided slot in context
 * Parent is able to see that the slot has been fulfilled
 *
 * Copied from RAC: https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/utils.tsx#L213
 * Due to not being exported, but quite handy
 */
export function useSlot(): [RefCallback<Element>, boolean] {
  // Assume we do have the slot in the initial render.
  let [hasSlot, setHasSlot] = useState(true);
  let hasRun = useRef(false);

  // A callback ref which will run when the slotted element mounts.
  // This should happen before the useLayoutEffect below.
  let ref = useCallback((el: HTMLElement | null) => {
    hasRun.current = true;
    setHasSlot(!!el);
  }, []);

  // If the callback hasn't been called, then reset to false.
  useLayoutEffect(() => {
    if (!hasRun.current) {
      setHasSlot(false);
    }
  }, []);

  return [ref, hasSlot];
}
