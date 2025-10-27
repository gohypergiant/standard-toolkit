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
import {
  Dialog as AriaDialog,
  composeRenderProps,
  DialogTrigger,
  Modal,
  ModalOverlay,
  useContextProps,
} from 'react-aria-components';
import { PortalProvider } from '@/providers/portal';
import { DialogContext } from './context';
import { DialogContent } from './dialog-content';
import { DialogFooter } from './dialog-footer';
import { DialogTitle } from './dialog-title';
import { DialogStyles } from './styles';
import type { DialogProps } from './types';

const { overlay, modal, dialog } = DialogStyles();

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

  const { children, classNames, parentRef, size = 'small', ...rest } = props;

  return (
    <DialogContext.Provider value={props}>
      <PortalProvider parentRef={parentRef}>
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
      </PortalProvider>
    </DialogContext.Provider>
  );
}

Dialog.Trigger = DialogTrigger;
Dialog.Title = DialogTitle;
Dialog.Content = DialogContent;
Dialog.Footer = DialogFooter;
