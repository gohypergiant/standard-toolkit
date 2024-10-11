import {
  createContext,
  forwardRef,
  useCallback,
  useMemo,
  type ForwardedRef,
  type HTMLAttributes,
} from 'react';
import {
  DEFAULT_SLOT,
  Dialog as RACDialog,
  Provider,
  Popover as RACPopover,
  useContextProps,
  type ContextValue,
  type PopoverRenderProps as RACPopoverRenderProps,
} from 'react-aria-components';
import { useDefaultProps, useSlot, useTheme } from '../../hooks';
import { headings } from '../../styles';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { AriaHeadingContext } from '../aria';
import { ButtonContext, type ButtonProps } from '../button';
import { ElementContext, type ElementProps } from '../element';
import { GroupContext, type GroupProps } from '../group';
import { popoverClassNames, popoverStateVars } from './popover.css';
import type { PopoverMapping, PopoverProps } from './types';

const defaultMapping: PopoverMapping = {
  heading: headings.v4,
  actions: {
    context: ButtonContext,
    orientation: 'horizontal',
    reverse: true,
  },
  primary: {
    size: 'sm',
  },
  secondary: { size: 'sm', variant: 'bare' },
};

export const PopoverContext =
  createContext<ContextValue<PopoverProps, HTMLElement>>(null);

export const Popover = forwardRef(function Popover(
  props: PopoverProps,
  ref: ForwardedRef<HTMLElement>,
) {
  [props, ref] = useContextProps(props, ref, PopoverContext);
  props = useDefaultProps(props, 'Popover');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    mapping: mappingProp,
    ...rest
  } = props;

  const theme = useTheme();

  const mapping = useMemo(
    () => ({ ...defaultMapping, ...mappingProp }),
    [mappingProp],
  );

  const classNames = useMemo(
    () =>
      mergeClassNames(popoverClassNames, theme.Popover, classNamesProp, {
        popover: {
          container: theme.className, // required to consume global theme within Popover
        },
      }),
    [theme.className, theme.Popover, classNamesProp],
  );

  const [headerRef, hasHeader] = useSlot();

  const style = useCallback(
    (renderProps: RACPopoverRenderProps) =>
      inlineVars(popoverStateVars, {
        ...theme.style, // required to consume global styles within Popover
        ...renderProps,
        hasHeader,
      }),
    [theme.style, hasHeader],
  );

  const values = useMemo<
    [
      [
        typeof ElementContext,
        ContextValue<
          ElementProps<
            ContextValue<HTMLAttributes<HTMLElement>, HTMLHeadingElement>,
            ContextValue<
              GroupProps<ButtonProps, HTMLButtonElement>,
              HTMLDivElement
            >
          >,
          HTMLElement
        >,
      ],
    ]
  >(
    () => [
      [
        ElementContext,
        {
          slots: {
            [DEFAULT_SLOT]: {},
            header: {
              as: 'header',
              className: classNames?.header,
              ref: headerRef,
              values: [
                [
                  AriaHeadingContext,
                  {
                    className: mapping.heading,
                    slot: 'title',
                  },
                ],
                [GroupContext, null],
              ],
            },
            content: { className: classNames?.content },
            footer: {
              as: 'footer',
              className: classNames?.footer,
              values: [
                [AriaHeadingContext, null],
                [
                  GroupContext,
                  {
                    values: {
                      slots: {
                        [DEFAULT_SLOT]: mapping.primary ?? {},
                        secondary: mapping.secondary ?? {},
                      },
                    },
                    ...mapping.actions,
                  },
                ],
              ],
            },
          },
        },
      ],
    ],
    [
      classNames?.header,
      classNames?.content,
      classNames?.footer,
      headerRef,
      mapping.actions,
      mapping.heading,
      mapping.primary,
      mapping.secondary,
    ],
  );

  const children = useCallback(
    (renderProps: RACPopoverRenderProps) => (
      <Provider values={values}>
        <RACDialog className={classNames?.popover?.popover}>
          {({ close }) =>
            callRenderProps(childrenProp, {
              ...renderProps,
              close,
              defaultChildren: null,
            })
          }
        </RACDialog>
      </Provider>
    ),
    [childrenProp, classNames?.popover?.popover, values],
  );

  return (
    <RACPopover
      {...rest}
      ref={ref}
      className={classNames?.popover?.container}
      style={style}
    >
      {children}
    </RACPopover>
  );
});
