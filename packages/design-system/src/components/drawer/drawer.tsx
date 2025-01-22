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

import { toBoolean } from '@accelint/converters';
import { noop } from '@accelint/core';
import { useFocusWithin } from '@react-aria/interactions';
import { useOverlay } from '@react-aria/overlays';
import { useIsSSR } from '@react-aria/ssr';
import { useOverlayTriggerState } from '@react-stately/overlays';
import type { PressEvent } from '@react-types/shared';
import {
  type ForwardedRef,
  type HTMLAttributes,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import {
  type ContextValue,
  DEFAULT_SLOT,
  Provider,
} from 'react-aria-components';
import {
  useContextProps,
  useDefaultProps,
  useSlot,
  useTheme,
} from '../../hooks';
import { headings } from '../../styles';
import {
  callRenderProps,
  inlineVars,
  mergeClassNames,
  mergeProps,
} from '../../utils';
import { AriaHeadingContext } from '../aria';
import { ButtonContext, type ButtonProps } from '../button';
import { ElementContext, type ElementProps } from '../element';
import { Tab, TabList, type TabRenderProps, Tabs } from '../tabs';
import {
  TooltipContext,
  type TooltipProps,
  TooltipTargetContext,
  type TooltipTargetProps,
} from '../tooltip';
import {
  drawerClassNames,
  drawerDialogStateVars,
  drawerStateVars,
} from './drawer.css';
import type {
  DrawerContextValue,
  DrawerDialogProps,
  DrawerMapping,
  DrawerProps,
  DrawerTabListProps,
  DrawerTabProps,
} from './types';

const DrawerContext = createContext<DrawerContextValue>({
  anchor: 'right',
  layoutShift: false,
  isOpen: false,
  close: noop,
  open: noop,
  setOpen: noop,
  toggle: noop,
});

export function Drawer(props: DrawerProps) {
  props = useDefaultProps(props, 'Drawer');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    anchor = 'right',
    defaultOpen = false,
    layoutShift = false,
    shouldCloseOnBlur = false,
    isDismissable = true,
    isKeyboardDismissDisabled = false,
    isOpen: isOpenProp,
    onOpenChange,
  } = props;

  const theme = useTheme();
  const isSSR = useIsSSR();

  const classNames = useMemo(
    () => mergeClassNames(drawerClassNames, theme.Drawer, classNamesProp),
    [theme.Drawer, classNamesProp],
  );

  // Remove focus when Drawer closes
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        const focused = isSSR ? null : document.activeElement;

        if (
          focused &&
          'blur' in focused &&
          typeof focused.blur === 'function'
        ) {
          focused.blur();
        }
      }

      onOpenChange?.(isOpen);
    },
    [isSSR, onOpenChange],
  );

  const state = useOverlayTriggerState({
    defaultOpen,
    isOpen: isOpenProp,
    onOpenChange: handleOpenChange,
  });

  const { isOpen, close, open } = state;
  const ref = useRef<HTMLDivElement>(null);

  const { overlayProps } = useOverlay(
    {
      isOpen,
      shouldCloseOnBlur,
      isDismissable,
      isKeyboardDismissDisabled,
      onClose: close,
    },
    ref,
  );

  // TODO: it may be desirable to disallow focus within the closed Drawer instead
  // If focus forces the Drawer open
  const { focusWithinProps } = useFocusWithin({
    onFocusWithin: open,
  });

  const context = useMemo(
    () => ({ ...state, anchor, layoutShift }),
    [state, anchor, layoutShift],
  );

  const values = useMemo<
    [
      [typeof DrawerContext, DrawerContextValue],
      [
        typeof DrawerDialogContext,
        ContextValue<DrawerDialogProps, HTMLDivElement>,
      ],
    ]
  >(
    () => [
      [DrawerContext, context],
      [DrawerDialogContext, { classNames }],
    ],
    [context, classNames],
  );

  const style = useMemo(
    () =>
      inlineVars(drawerStateVars, {
        anchor,
        layoutShift,
        isOpen,
      }),
    [anchor, layoutShift, isOpen],
  );

  const children = useMemo(
    () => callRenderProps(childrenProp, state),
    [childrenProp, state],
  );

  return (
    <Provider values={values}>
      <div
        {...mergeProps(overlayProps, focusWithinProps)}
        ref={ref}
        className={classNames?.container}
        style={style}
      >
        <Tabs classNames={classNames?.tabs}>{children}</Tabs>
      </div>
    </Provider>
  );
}

export function DrawerTabList<T extends object>(props: DrawerTabListProps<T>) {
  props = useDefaultProps(props, 'DrawerTabList');

  const { children, classNames: classNamesProp, variant = 'fill' } = props;
  const { anchor } = useContext(DrawerContext);
  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(drawerClassNames, theme.Drawer, classNamesProp),
    [theme.Drawer, classNamesProp],
  );

  const values = useMemo<
    [
      [typeof TooltipContext, ContextValue<TooltipProps, HTMLDivElement>],
      [
        typeof TooltipTargetContext,
        ContextValue<TooltipTargetProps, HTMLDivElement>,
      ],
    ]
  >(
    () => [
      [TooltipContext, { placement: anchor === 'left' ? 'right' : 'left' }],
      [TooltipTargetContext, { focusable: false, relative: 'parent' }],
    ],
    [anchor],
  );

  return (
    <Provider values={values}>
      <TabList<T>
        classNames={classNames?.tabs}
        align='center'
        anchor={anchor === 'left' ? 'start' : 'end'}
        orientation='vertical'
        variant={variant}
      >
        {children}
      </TabList>
    </Provider>
  );
}

export function DrawerTab(props: DrawerTabProps) {
  props = useDefaultProps(props, 'DrawerTab');

  const { children: childrenProp, classNames: classNamesProp, ...rest } = props;
  const { isOpen, open, toggle } = useContext(DrawerContext);
  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(drawerClassNames, theme.Drawer, classNamesProp),
    [theme.Drawer, classNamesProp],
  );

  // Must bind to press start (instead of later press events) due to Tab changing selected state on start
  const handlePressStart = useCallback(
    (event: PressEvent) => {
      const { selected } = event.target.parentElement?.dataset ?? {};

      if (toBoolean(selected)) {
        toggle();
      } else {
        open();
      }
    },
    [open, toggle],
  );

  const children = useCallback(
    (renderProps: TabRenderProps) =>
      callRenderProps(childrenProp, { ...renderProps, isOpen }),
    [childrenProp, isOpen],
  );

  return (
    <Tab
      {...rest}
      classNames={classNames?.tabs}
      onPressStart={handlePressStart}
    >
      {children}
    </Tab>
  );
}

const defaultMapping: DrawerMapping = {
  heading: {
    child: headings.v4,
    parent: headings.v3,
  },
  back: {
    variant: 'icon',
  },
  close: {
    variant: 'icon',
  },
};

export const DrawerDialogContext =
  createContext<ContextValue<DrawerDialogProps, HTMLDivElement>>(null);

export const DrawerDialog = forwardRef(function DrawerDialog(
  props: DrawerDialogProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, DrawerDialogContext);

  const {
    children,
    classNames: classNamesProp,
    mapping: mappingProp,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props;

  const { close } = useContext(DrawerContext);
  const [backRef, hasBack] = useSlot();
  const [titleRef, hasTitle] = useSlot();
  const theme = useTheme();

  const mapping = useMemo(
    () => ({ ...defaultMapping, ...mappingProp }),
    [mappingProp],
  );

  const classNames = useMemo(
    () =>
      mergeClassNames(drawerClassNames, theme.Drawer, classNamesProp, {
        header: {
          title: hasBack ? mapping.heading.child : mapping.heading.parent,
        },
      }),
    [theme.Drawer, classNamesProp, hasBack, mapping],
  );

  const style = useMemo(
    () =>
      inlineVars(drawerDialogStateVars, {
        isChild: !!hasBack,
      }),
    [hasBack],
  );

  const values = useMemo<
    [
      [
        typeof ElementContext,
        ContextValue<
          ElementProps<
            ContextValue<ButtonProps, HTMLButtonElement>,
            ContextValue<HTMLAttributes<HTMLElement>, HTMLHeadingElement>
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
              className: classNames?.header?.header,
              values: [
                [
                  ButtonContext,
                  {
                    slots: {
                      [DEFAULT_SLOT]: {},
                      back: {
                        ...mapping.back,
                        ref: backRef,
                        classNames: classNames?.header?.back,
                      },
                      close: {
                        ...mapping.close,
                        classNames: classNames?.header?.close,
                        onPress: close,
                      },
                    },
                  },
                ],
                [
                  AriaHeadingContext,
                  {
                    slots: {
                      title: {
                        ref: titleRef,
                        className: classNames?.header?.title,
                      },
                    },
                  },
                ],
              ],
            },
            content: { className: classNames?.content },
            footer: { as: 'footer', className: classNames?.footer },
          },
        },
      ],
    ],
    [
      classNames?.header?.header,
      classNames?.header?.back,
      classNames?.header?.close,
      classNames?.header?.title,
      classNames?.content,
      classNames?.footer,
      backRef,
      close,
      mapping,
      titleRef,
    ],
  );

  // biome-ignore lint/complexity/useSimplifiedLogicExpression: intentional
  if (!ariaLabel && !ariaLabelledBy && !hasTitle) {
    console.warn(
      'If a Drawer does not contain a <Heading slot="title">, it must have an aria-label or aria-labelledby attribute for accessibility.',
    );
  }

  return (
    <Provider values={values}>
      <div
        {...rest}
        className={classNames?.dialog?.container}
        style={style}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        <div className={classNames?.dialog?.dialog}>{children}</div>
      </div>
    </Provider>
  );
});
