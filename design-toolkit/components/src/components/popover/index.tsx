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

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading as AriaHeading,
  Popover as AriaPopover,
  Pressable,
} from 'react-aria-components';

import type {
  PopoverBodyProps,
  PopoverContentProps,
  PopoverProps,
  PopoverTitleProps,
  PopoverTriggerProps,
} from './types';

export const Popover = ({
  placement = 'bottom',
  children,
  ...rest
}: PopoverProps) => {
  /* @ts-expect-error package version mismatch TODO */
  return <AriaDialogTrigger {...rest}>{children}</AriaDialogTrigger>;
};
Popover.displayName = 'Popover';

export const PopoverTrigger = ({ children, ...props }: PopoverTriggerProps) => {
  return <Pressable {...props}>{children}</Pressable>;
};
Popover.displayName = 'Popover.Trigger';

const PopoverContent = ({
  children,
  className,
  ...rest
}: PopoverContentProps) => {
  return (
    <AriaPopover
      className={cn(
        'max-w-[280px] rounded-medium border border-static-light bg-surface-raised p-s',
        className,
      )}
      {...rest}
    >
      {/* @ts-expect-error package version mismatch TODO */}
      <AriaDialog>{children}</AriaDialog>
    </AriaPopover>
  );
};
PopoverContent.displayName = 'Popover.Content';

const PopoverTitle = ({ children, className, ...rest }: PopoverTitleProps) => {
  return (
    <AriaHeading
      slot='title'
      className={cn('fg-default-light mb-s text-header-m', className)}
      {...rest}
    >
      {/* @ts-expect-error package version mismatch TODO */}
      {children}
    </AriaHeading>
  );
};

PopoverTitle.displayName = 'Popover.Title';

const PopoverBody = ({ children, className }: PopoverBodyProps) => {
  return (
    <div className={cn('fg-default-dark text-body-s', className)}>
      {children}
    </div>
  );
};
PopoverBody.displayName = 'Popover.Body';

const PopoverFooter = ({
  children,
  className,
}: { children: ReactNode; className?: string }) => {
  return (
    <div className={cn('mt-s flex justify-end gap-s', className)}>
      {children}
    </div>
  );
};
PopoverFooter.displayName = 'Popover.Footer';

Popover.Title = PopoverTitle;
Popover.Content = PopoverContent;
Popover.Body = PopoverBody;
Popover.Footer = PopoverFooter;
Popover.Trigger = PopoverTrigger;
