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

import {
  createContext,
  type ForwardedRef,
  forwardRef,
  type HTMLAttributes,
  useCallback,
  useMemo,
} from 'react';
import {
  type ContextValue,
  DEFAULT_SLOT,
  Dialog as RACDialog,
  Popover as RACPopover,
  type PopoverRenderProps as RACPopoverRenderProps,
  Provider,
} from 'react-aria-components';
import {
  useContextProps,
  useDefaultProps,
  useSlot,
  useTheme,
} from '../../hooks';
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
