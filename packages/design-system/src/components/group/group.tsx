import {
  Children,
  createContext,
  forwardRef,
  useMemo,
  type ForwardedRef,
  type ReactElement,
} from 'react';
import { type ContextValue } from 'react-aria-components';
import { useContextProps, useTheme } from '../../hooks';
import { inlineVars, mergeClassNames } from '../../utils';
import { MergeProvider } from '../merge-provider';
import { groupClassNames, groupStateVars } from './group.css';
import { type GroupProps } from './types';

export const GroupContext =
  // Unforunately, using "unknown" or "object" here creates complex type issues with <Provider />
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createContext<ContextValue<GroupProps<any, Element>, HTMLDivElement>>(null);

/**
 * This generic component allows for collective prop distribution to a collection of components of the same type
 *
 * @example A list of <Button />s and you want to control their size instead of passing the same props to each
 */
export const Group = forwardRef(function Group<T, E extends Element>(
  props: GroupProps<T, E>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, GroupContext);

  const {
    children: childrenProp,
    classNames: classNamesProp,
    context,
    orientation = 'horizontal',
    reverse = false,
    values: valuesProp,
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(groupClassNames, theme.Group, classNamesProp),
    [theme.Group, classNamesProp],
  );

  const style = useMemo(() => {
    const types = Children.toArray(childrenProp).reduce<Set<string>>(
      (acc, child) => {
        if (
          child &&
          typeof child !== 'boolean' &&
          typeof child !== 'number' &&
          typeof child !== 'string'
        ) {
          const type = (child as ReactElement).type;
          // @ts-expect-error TS doesn't know about "render" type
          const name = typeof type !== 'string' ? type.render?.name : type;

          if (name) {
            acc.add(name);
          }
        }

        return acc;
      },
      new Set<string>(),
    );

    const type = { 0: 'Empty', 1: [...types].at(0) }[types.size] ?? 'Mixed';

    return inlineVars(groupStateVars, {
      count: Children.count(childrenProp),
      orientation,
      reverse,
      type,
    });
  }, [childrenProp, orientation, reverse]);

  const values = useMemo<
    [[Exclude<typeof context, undefined>, ContextValue<T, E>]]
  >(() => [[context!, valuesProp]], [context, valuesProp]);

  const children = useMemo(
    () => (
      <div ref={ref} className={classNames?.container} style={style}>
        <div className={classNames?.group}>{childrenProp}</div>
      </div>
    ),
    [ref, classNames?.container, classNames?.group, style, childrenProp],
  );

  return context && valuesProp ? (
    <MergeProvider values={values}>{children}</MergeProvider>
  ) : (
    children
  );
});
