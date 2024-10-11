import { type Context, type ReactNode } from 'react';
import { mergeProps } from '../../utils';
import { type MergeProviderProps } from './types';

function merge<T>(context: Context<T>, next: T, children: ReactNode) {
  return function Consumer(prev: T) {
    let merged = next;

    if (
      prev != null &&
      next != null &&
      typeof prev === 'object' &&
      typeof next === 'object'
    ) {
      const prevSlots =
        'slots' in prev && (prev.slots as Record<string | symbol, object>);

      const nextSlots =
        'slots' in next && (next.slots as Record<string | symbol, object>);

      if (prevSlots && nextSlots) {
        merged = {
          ...prev,
          ...next,
          slots: {
            ...prevSlots,
            ...nextSlots,
            ...Reflect.ownKeys(nextSlots).reduce<
              Record<string | symbol, object>
            >((acc, key) => {
              const value = nextSlots[key];

              if (Object.hasOwn(prevSlots, key)) {
                acc[key] = mergeProps(prevSlots[key], value);
              }

              return acc;
            }, {}),
          },
        } as T;
      } else if (!prevSlots && !nextSlots) {
        merged = mergeProps(prev as object, next as object) as T;
      }
    }

    return <context.Provider value={merged}>{children}</context.Provider>;
  };
}

/**
 * Merges provided contexts with parent contexts, if available and of the same structure
 * If parent context doesn't exist or differs in structure (slotted vs non-slotted) from
 * the context being provided, the provided context will override the parent context
 *
 * This is typically used in conjunction with React Aria Component's contexts, where a
 * RAC may provide a slotted context (ex: ButtonContext, with a slot of "remove") where
 * that slot has a number of attributes and event listeners, but we want to merge in our
 * own to supplement things for stylistic or additional functionality purposes
 *
 * See tests for examples
 */
export function MergeProvider<A, B, C, D, E, F, G, H, I, J, K>({
  values,
  children,
}: MergeProviderProps<A, B, C, D, E, F, G, H, I, J, K>) {
  for (let [context, next] of values) {
    children = (
      <context.Consumer>
        {merge(context as Context<typeof next>, next, children)}
      </context.Consumer>
    );
  }

  return <>{children}</>;
}
