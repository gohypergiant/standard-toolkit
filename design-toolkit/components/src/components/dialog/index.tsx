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
import { cn } from '@/lib/utils';
import { useIsSSR } from '@react-aria/ssr';
import 'client-only';
import { cva } from 'cva';
import {
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  type DialogRenderProps,
  type DialogTriggerProps,
  Dialog as RACDialog,
  DialogTrigger as RACDialogTrigger,
  Heading as RACHeading,
  Modal as RACModal,
  ModalOverlay as RACModalOverlay,
} from 'react-aria-components';
import { Button } from '../button';
import type { ButtonProps } from '../button/types';

const dialogClasses = cva(
  'flex flex-col align-end font-light text-body-m text-default-dark',
  {
    variants: {
      size: {
        sm: 'min-w-[280px] max-w-[280px] rounded-medium p-l',
        lg: 'min-w-[320px] max-w-[720px] rounded-large p-xl',
      },
      defaultVariants: {
        size: 'sm',
      },
    },
  },
);

const buttonSizes: Record<string, ButtonProps['size']> = {
  sm: 'small',
  lg: 'medium',
};

type DialogSize = 'sm' | 'lg';

interface DialogContextValue {
  size: DialogSize;
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  parentRef?: RefObject<HTMLElement | null>;
}

const DialogContext = createContext<DialogContextValue>({ size: 'sm' });

const useDialogContext = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error('Dialog components must be used within <Dialog>');
  }
  return ctx;
};

export interface DialogProps extends DialogTriggerProps {
  size?: DialogSize;
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  parentRef?: RefObject<HTMLElement | null>;
}

export const Dialog = ({
  children,
  size,
  isOpen,
  onOpenChange,
  isDismissable = true,
  isKeyboardDismissDisabled = true,
  parentRef,
}: DialogProps) => {
  return (
    <RACDialogTrigger>
      <DialogContext.Provider
        value={{
          size: size ?? 'sm',
          isDismissable,
          isOpen,
          onOpenChange,
          parentRef,
          isKeyboardDismissDisabled,
        }}
      >
        {children}
      </DialogContext.Provider>
    </RACDialogTrigger>
  );
};
Dialog.displayName = 'Dialog';

interface DialogBodyProps {
  children: ReactNode | ReactNode[] | ((opts: DialogRenderProps) => ReactNode);
}

const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ children, ...rest }, ref) => {
    const {
      size,
      isDismissable,
      isOpen,
      onOpenChange,
      parentRef,
      isKeyboardDismissDisabled,
    } = useDialogContext();
    const isSSR = useIsSSR();
    const [portal, setPortal] = useState(isSSR ? null : document.body);

    useEffect(() => {
      const node = parentRef?.current;
      /* Ensure proper ssr hydration TODO */
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

    return portal ? (
      <RACModalOverlay
        UNSTABLE_portalContainer={portal}
        isKeyboardDismissDisabled={!isDismissable && isKeyboardDismissDisabled}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={isDismissable}
        className='absolute inset-0 flex items-center justify-center'
        {...rest}
      >
        <RACModal
          ref={ref}
          className={cn(
            'flex flex-col justify-center bg-surface-overlay align-start',
            size === 'sm' && 'rounded-medium',
            size === 'lg' && 'rounded-large',
          )}
        >
          <RACDialog className={dialogClasses({ size })}>{children}</RACDialog>
        </RACModal>
      </RACModalOverlay>
    ) : null;
  },
);
DialogBody.displayName = 'DialogBody';

const DialogContent = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  const { size } = useDialogContext();
  return (
    <div
      className={cn(
        'flex flex-col',
        size === 'sm' && 'gap-xs',
        size === 'lg' && 'gap-l',
        className,
      )}
    >
      {children}
    </div>
  );
};

export const DialogTitle = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  const { size } = useDialogContext();
  return (
    <RACHeading
      slot='title'
      className={cn(
        'text-default-light',
        size === 'sm' && 'mb-s text-header-m',
        size === 'lg' && 'mb-m text-header-l',
        className,
      )}
    >
      {children}
    </RACHeading>
  );
};

const DialogButton = ({ children, className, ...props }: ButtonProps) => {
  const { size: dialogSize } = useDialogContext();
  const buttonSize = buttonSizes[dialogSize];
  return (
    <Button
      size={buttonSize}
      {...props}
      //overriding the style to deal with rac's pressed state inherited
      //from the trigger state
      className={cn('dtk-pressed:bg-initial', className)}
    >
      {children}
    </Button>
  );
};

const DialogFooter = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  const { size } = useDialogContext();
  return (
    <div
      className={cn(
        'flex justify-end gap-xs',
        size === 'sm' && 'mt-l',
        size === 'lg' && 'mt-xl',
        className,
      )}
    >
      {children}
    </div>
  );
};

Dialog.Button = DialogButton;
Dialog.Content = DialogContent;
Dialog.Footer = DialogFooter;
Dialog.Title = DialogTitle;
Dialog.Body = DialogBody;
