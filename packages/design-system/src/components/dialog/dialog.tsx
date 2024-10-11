import { useIsSSR } from '@react-aria/ssr';
import {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ForwardedRef,
  type HTMLAttributes,
} from 'react';
import {
  DEFAULT_SLOT,
  Modal,
  ModalOverlay,
  Provider,
  Dialog as RACDialog,
  type ContextValue,
  type ModalRenderProps,
} from 'react-aria-components';
import {
  useContextProps,
  useDefaultProps,
  useSlot,
  useTheme,
} from '../../hooks';
import { headings } from '../../styles';
import type { OmitProtectedProps } from '../../types';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { AriaHeadingContext } from '../aria';
import { ButtonContext, type ButtonProps } from '../button';
import { ElementContext, type ElementProps } from '../element';
import { GroupContext, type GroupProps } from '../group';
import { dialogClassNames, dialogStateVars } from './dialog.css';
import type {
  DialogMapping,
  DialogProps,
  DialogSizes,
} from './types';

const dialogSizes: DialogSizes[] = ['sm', 'lg'];

const defaultMapping: DialogMapping = {
  heading: {
    sm: { className: headings.v4 },
    lg: { className: headings.v2 },
  },
  actions: {
    context: ButtonContext,
    orientation: 'horizontal',
    reverse: true,
  },
  primary: dialogSizes.reduce(
    (acc, size) => {
      acc[size] = { size };

      return acc;
    },
    {} as Record<DialogSizes, OmitProtectedProps<ButtonProps>>,
  ),
  secondary: dialogSizes.reduce(
    (acc, size) => {
      acc[size] = { size, variant: 'bare' };

      return acc;
    },
    {} as Record<DialogSizes, OmitProtectedProps<ButtonProps>>,
  ),
};

export const DialogContext =
  createContext<ContextValue<DialogProps, HTMLDivElement>>(null);

export const Dialog = forwardRef(function Dialog(
  props: DialogProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, DialogContext);
  props = useDefaultProps(props, 'Dialog');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    mapping: mappingProp,
    parentRef,
    role,
    size = 'lg',
    ...rest
  } = props;

  const theme = useTheme();
  const isSSR = useIsSSR();
  const [portal, setPortal] = useState(isSSR ? null : document.body);

  const isGlobal = useMemo(
    () => !isSSR && portal === document.body,
    [isSSR, portal],
  );

  const mapping = useMemo(
    () => ({ ...defaultMapping, ...mappingProp }),
    [mappingProp],
  );

  const classNames = useMemo(
    () =>
      mergeClassNames(dialogClassNames, theme.Dialog, classNamesProp, {
        container: isGlobal ? theme.className : undefined,
      }),
    [theme.Dialog, classNamesProp, isGlobal, theme.className],
  );

  const [headerRef, hasHeader] = useSlot();

  const style = useCallback(
    ({ state, ...renderProps }: ModalRenderProps) => ({
      ...(isGlobal ? theme.style : {}),
      ...inlineVars(dialogStateVars, {
        hasHeader,
        size,
        ...renderProps,
        isGlobal,
      }),
    }),
    [size, theme.style, isGlobal, hasHeader],
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
                    ...mapping.heading[size],
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
                        [DEFAULT_SLOT]: mapping.primary[size] ?? {},
                        secondary: mapping.secondary[size] ?? {},
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
      size,
    ],
  );

  const children = useCallback(
    (renderProps: ModalRenderProps) => (
      <Provider values={values}>
        <Modal className={classNames?.modal}>
          <RACDialog className={classNames?.dialog} role={role}>
            {callRenderProps(childrenProp, {
              ...renderProps,
              isGlobal,
              isOpen: renderProps.state.isOpen,
            })}
          </RACDialog>
        </Modal>
      </Provider>
    ),
    [
      values,
      classNames?.modal,
      classNames?.dialog,
      role,
      childrenProp,
      isGlobal,
    ],
  );

  useEffect(() => {
    const node = parentRef?.current;
    const port = isSSR ? null : document.createElement('div');

    if (node && port) {
      port.classList.add(classNames?.portal ?? '');

      node.appendChild(port);

      setPortal(port);
    }

    return () => {
      port?.remove();

      setPortal(isSSR ? null : document.body);
    };
  }, [isSSR, parentRef, classNames?.portal]);

  if (!portal) return null;

  return (
    <ModalOverlay
      {...rest}
      ref={ref}
      className={classNames?.container}
      style={style}
      UNSTABLE_portalContainer={portal}
    >
      {children}
    </ModalOverlay>
  );
});
