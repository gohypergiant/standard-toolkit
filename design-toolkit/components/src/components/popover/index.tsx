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
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from 'react-aria-components';

const popoverStyles =
  'bg-surface-raised rounded-medium max-w-[280px] border border-static-light p-s';

interface PopoverProps extends Omit<AriaPopoverProps, 'children'> {
  placement?: 'left' | 'right' | 'top' | 'bottom';
  header?: string;
  body?: string | ReactNode;
}

export const Popover = ({
  className,
  placement = 'bottom',
  header,
  body,
  ...rest
}: PopoverProps) => {
  return (
    <AriaPopover
      placement={placement}
      className={cn(popoverStyles, className)}
      {...rest}
    >
      <AriaDialog>
        {header && <PopoverHeader>{header}</PopoverHeader>}
        {typeof body === 'string' ? (
          <PopoverBody>{body}</PopoverBody>
        ) : (
          <>{body}</>
        )}
      </AriaDialog>
    </AriaPopover>
  );
};

Popover.displayName = 'Popover';

interface PopoverHeaderProps extends Omit<AriaHeadingProps, 'children'> {
  children?: string;
}

const PopoverHeader = ({ children }: PopoverHeaderProps) => {
  return (
    <AriaHeading slot='title' className='fg-default-light mb-s text-header-m'>
      {children}
    </AriaHeading>
  );
};

interface PopoverBodyProps {
  children?: string;
}

const PopoverBody = ({ children }: PopoverBodyProps) => {
  return <p className='fg-default-dark text-body-m'>{children}</p>;
};
