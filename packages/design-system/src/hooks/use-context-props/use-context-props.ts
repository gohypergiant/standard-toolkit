import { mergeRefs, useObjectRef } from '@react-aria/utils';
import {
  type Context,
  type ForwardedRef,
  type RefObject,
  useMemo,
} from 'react';
import {
  type ContextValue,
  type SlotProps,
  useSlottedContext,
} from 'react-aria-components';
import { mergeProps } from '../../utils';

/**
 * Reimplementation of React Aria's useContextProps, to utilize our own
 * mergeProps which handles renderProps and classNames
 */
export function useContextProps<T, U extends SlotProps, E extends Element>(
  props: T & SlotProps,
  ref: ForwardedRef<E>,
  context: Context<ContextValue<U, E>>,
): [T, RefObject<E | null>] {
  const value = (useSlottedContext(context, props.slot) ?? {}) as Partial<T> & {
    ref?: ForwardedRef<E>;
  };

  const { ref: contextRef, ...contextProps } = value;

  return [
    mergeProps(contextProps as Partial<T>, props) as T,
    useObjectRef(useMemo(() => mergeRefs(ref, contextRef), [ref, contextRef])),
  ];
}
