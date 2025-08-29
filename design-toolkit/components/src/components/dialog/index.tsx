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
'use client';

import 'client-only';
import { isSlottedContextValue } from '@/lib/utils';
import { UNSAFE_PortalProvider } from '@react-aria/overlays';
import { useIsSSR } from '@react-aria/ssr';
import {
  type ComponentProps,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Dialog as AriaDialog,
  type ContextValue,
  DialogTrigger,
  Heading,
  type HeadingProps,
  Modal,
  ModalOverlay,
  OverlayTriggerStateContext,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { ButtonContext } from '../button';
import { DialogStyles } from './styles';
import type { DialogProps } from './types';

const { overlay, modal, dialog, title, content, footer } = DialogStyles();

export const DialogContext =
  createContext<ContextValue<DialogProps, HTMLDivElement>>(null);

function DialogTitle({ children, className }: HeadingProps) {
  return (
    <Heading slot='title' className={title({ className })}>
      {children}
    </Heading>
  );
}
DialogTitle.displayName = 'Dialog.Title';

function DialogContent({ children, className }: ComponentProps<'div'>) {
  return <div className={content({ className })}>{children}</div>;
}
DialogContent.displayName = 'Dialog.Content';

function DialogFooter({ children, className }: ComponentProps<'footer'>) {
  const context = useContext(DialogContext);
  const size =
    (isSlottedContextValue(context) ? null : context?.size) ?? 'small';
  const state = useContext(OverlayTriggerStateContext);

  return (
    <footer className={footer({ className })}>
      <ButtonContext.Provider
        value={{
          size,
          onPress: state?.close ?? (() => undefined),
        }}
      >
        {children}
      </ButtonContext.Provider>
    </footer>
  );
}

DialogFooter.displayName = 'Dialog.Footer';

/**
 * Dialog - A modal dialog component for important content and interactions
 *
 * Provides accessible modal functionality with focus management, backdrop handling,
 * and keyboard navigation. Supports multiple sizes and customizable dismissal behavior.
 * Perfect for confirmations, forms, or any content requiring user focus.
 *
 * @example
 * // Basic dialog with trigger
 * <Dialog.Trigger>
 *   <Button>Open Dialog</Button>
 *   <Dialog>
 *     {({ close }) => (
 *       <>
 *         <Dialog.Title>Confirm Action</Dialog.Title>
 *         <p>Are you sure you want to continue?</p>
 *         <Dialog.Footer>
 *           <Dialog.Button onPress={close}>Confirm</Dialog.Button>
 *         </Dialog.Footer>
 *       </>
 *     )}
 *   </Dialog>
 * </Dialog.Trigger>
 */
export function Dialog({ ref, ...props }: DialogProps) {
  [props, ref] = useContextProps(props, ref ?? null, DialogContext);

  const isSSR = useIsSSR();
  const [portal, setPortal] = useState(isSSR ? null : document.body);
  const { children, classNames, parentRef, size = 'small', ...rest } = props;

  useEffect(() => {
    const node = parentRef?.current;
    // TODO: Ensure proper ssr hydration
    const port = isSSR ? null : document.createElement('div');

    if (node && port) {
      node.appendChild(port);

      setPortal(port);
    }

    return () => {
      port?.remove();

      setPortal(isSSR ? null : document.body);
    };
  }, [isSSR, parentRef]);

  return (
    <DialogContext.Provider value={props}>
      <UNSAFE_PortalProvider getContainer={() => portal}>
        <ModalOverlay
          {...rest}
          ref={ref}
          className={composeRenderProps(classNames?.overlay, (className) =>
            overlay({ className }),
          )}
          data-size={size}
        >
          <Modal
            className={composeRenderProps(classNames?.modal, (className) =>
              modal({ className }),
            )}
          >
            <AriaDialog className={dialog({ className: classNames?.dialog })}>
              {children}
            </AriaDialog>
          </Modal>
        </ModalOverlay>
      </UNSAFE_PortalProvider>
    </DialogContext.Provider>
  );
}
Dialog.displayName = 'Dialog';
Dialog.Trigger = DialogTrigger;
Dialog.Title = DialogTitle;
Dialog.Content = DialogContent;
Dialog.Footer = DialogFooter;
