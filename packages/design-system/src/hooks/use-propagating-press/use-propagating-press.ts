import { type PressHookProps, usePress } from 'react-aria';
import { continuePropagation, mergeProps } from '../../utils';

/**
 * The default behavior of usePress is to stop all propagation of press events
 *
 * To allow the more typical behavior of event propagation by default, this hook
 * continues propagation of press events. This allows for nested press event
 * listeners to not block press event listeners higher in the heirarchy
 */
export function usePropagatingPress(props: PressHookProps) {
  return usePress(
    mergeProps(
      {
        onPress: continuePropagation,
        onPressEnd: continuePropagation,
        onPressStart: continuePropagation,
        onPressUp: continuePropagation,
      },
      props,
    ),
  );
}
