/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { useIsSSR } from '@react-aria/ssr';
import {
  type ForwardedRef,
  type HTMLAttributes,
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  type ContextValue,
  DEFAULT_SLOT,
  Modal,
  ModalOverlay,
  type ModalRenderProps,
  Provider,
  Dialog as RACDialog,
} from 'react-aria-components';
import { useContextProps } from '../../hooks/use-context-props';
import { useDefaultProps } from '../../hooks/use-defaults';
import { useSlot } from '../../hooks/use-slot';
import { useTheme } from '../../hooks/use-theme';
import { headings } from '../../styles/typography.css';
import type { OmitProtectedProps } from '../../types/props';
import { inlineVars } from '../../utils/css';
import { callRenderProps, mergeClassNames } from '../../utils/props';
import { AriaHeadingContext } from '../aria';
import { ButtonContext } from '../button';
import type { ButtonProps } from '../button/types';
import { ElementContext } from '../element';
import type { ElementProps } from '../element/types';
import { GroupContext } from '../group';
import type { GroupProps } from '../group/types';
import { dialogClassNames, dialogStateVars } from './dialog.css';
import type { DialogMapping, DialogProps, DialogSizes } from './types';

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
  close: dialogSizes.reduce(
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
                        close: mapping.close[size] ?? {},
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
      mapping.close,
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
