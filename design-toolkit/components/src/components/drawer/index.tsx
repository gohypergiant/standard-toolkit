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

import { Cancel } from '@accelint/icons';
import { PressResponder } from '@react-aria/interactions';
import { useOverlay } from '@react-aria/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import type { ReactNode } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { DrawerStyles, DrawerStylesDefaults } from './styles';
import type { DrawerContextValue, DrawerProps } from './types';

export const DrawerContext = createContext<DrawerContextValue>({
  position: 'left',
});

const { overlay, content, modal, dialog, attachedTrigger, header, footer } =
  DrawerStyles();

const DrawerTrigger = ({
  children,
  attached,
  className,
}: { children: ReactNode; attached?: boolean; className?: string }) => {
  const context = useContext(DrawerContext);

  if (!context.open) {
    throw new Error('Drawer.Trigger must be used within a Drawer component');
  }

  const handlePress = useCallback(() => {
    context.open?.();
  }, [context.open]);

  return (
    <div
      className={
        attached
          ? attachedTrigger({
              className,
              position: context.position,
              isDismissable: context.isDismissable,
              isKeyboardDismissDisabled: context.isKeyboardDismissDisabled,
              isOpen: context.isOpen,
            })
          : undefined
      }
    >
      <PressResponder onPress={handlePress}>{children}</PressResponder>
    </div>
  );
};
DrawerTrigger.displayName = 'Drawer.Trigger';

const DrawerContent = ({ children, ...props }: { children: ReactNode }) => {
  const context = useContext(DrawerContext);
  return (
    <div className={content()} {...props}>
      {typeof children === 'function'
        ? children({ close: context.close })
        : children}
    </div>
  );
};
DrawerContent.displayName = 'Drawer.Content';

const DrawerCloseButton = () => {
  const context = useContext(DrawerContext);

  if (!context.close) {
    throw new Error('Drawer.Trigger must be used within a Drawer component');
  }

  const handleClose = useCallback(() => {
    context.close?.();
  }, [context.close]);

  return (
    <Button variant='flat' size='small' onPress={handleClose}>
      <Icon>
        <Cancel />
      </Icon>
    </Button>
  );
};
DrawerCloseButton.displayName = 'Drawer.CloseButton';

const DrawerHeader = ({ children }: { children: ReactNode }) => {
  const context = useContext(DrawerContext);

  return (
    <div
      className={header({
        position: context.position,
        isDismissable: context.isDismissable,
        isKeyboardDismissDisabled: context.isKeyboardDismissDisabled,
        isOpen: context.isOpen,
      })}
    >
      <div className='text-default-light text-header-l w-full'>{children}</div>
      <DrawerCloseButton />
    </div>
  );
};
DrawerHeader.displayName = 'Drawer.Header';

const DrawerFooter = ({
  children,
  className,
}: { children: ReactNode; className?: string }) => {
  return <div className={footer({ className })}>{children}</div>;
};
DrawerFooter.displayName = 'Drawer.Footer';

export const Drawer = ({
  children,
  position = DrawerStylesDefaults.position,
  isOpen: isOpenProp,
  onOpenChange,
  isDismissable = DrawerStylesDefaults.isDismissable,
  isKeyboardDismissDisabled = DrawerStylesDefaults.isKeyboardDismissDisabled,
  parentRef,
}: DrawerProps) => {
  const state = useOverlayTriggerState({
    isOpen: isOpenProp,
    onOpenChange,
  });
  const ref = useRef(null);
  const { overlayProps } = useOverlay(
    {
      isOpen: state.isOpen,
      onClose: state.close,
      isDismissable,
    },
    ref,
  );

  const contextValue = useMemo(
    () => ({
      position,
      isDismissable,
      isKeyboardDismissDisabled,
      isOpen: state.isOpen,
      onOpenChange,
      parentRef,
      open: state.open,
      close: state.close,
      toggle: () => (state.isOpen ? state.close() : state.open()),
    }),
    [
      position,
      isDismissable,
      isKeyboardDismissDisabled,
      state,
      onOpenChange,
      parentRef,
    ],
  );

  const containerRef = useRef(null);

  const trigger = Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === DrawerTrigger,
  );
  const drawerContent = Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === DrawerContent,
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      {trigger}
      {state.isOpen && (
        <div
          {...overlayProps}
          ref={ref}
          className={overlay({
            position,
            isDismissable,
            isKeyboardDismissDisabled,
          })}
        >
          <div
            className={modal({
              position,
              isDismissable,
              isKeyboardDismissDisabled,
            })}
          >
            <div
              ref={containerRef}
              className={dialog({
                position,
                isDismissable,
                isKeyboardDismissDisabled,
              })}
            >
              {drawerContent}
            </div>
          </div>
        </div>
      )}
    </DrawerContext.Provider>
  );
};

Drawer.displayName = 'Drawer';
Drawer.Trigger = DrawerTrigger;
Drawer.Content = DrawerContent;
Drawer.Header = DrawerHeader;
Drawer.CloseButton = DrawerCloseButton;
Drawer.Footer = DrawerFooter;
