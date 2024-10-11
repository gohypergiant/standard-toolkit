import type { Context, ReactElement } from 'react';
import type { Orientation } from 'react-aria';
import type { ContextValue, SlotProps } from 'react-aria-components';

export type GroupClassNames = Partial<{
  container: string;
  group: string;
}>;

export type BaseGroupProps<T, E extends Element> = {
  children?: (ReactElement | boolean | null)[];
  classNames?: GroupClassNames;
  context?: Context<ContextValue<T, E>>;
  orientation?: Orientation;
  reverse?: boolean;
  values?: ContextValue<T, E>;
};

export type GroupState = {
  /**
   * The number of children rendered
   */
  count: number;
  orientation: Orientation;
  /**
   * Whether to flip the order of the children, visually
   */
  reverse: boolean;
  /**
   * This is based off of the children types
   *
   * Possible values: Empty, Mixed, {component type}
   *
   * @example If all children are <Button />, then "type" will be `Button`
   */
  type: string;
};

export type GroupProps<T, E extends Element> = BaseGroupProps<T, E> & SlotProps;
