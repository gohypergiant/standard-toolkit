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

import type React from 'react';
import {
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  DisclosurePanel as AriaDisclosurePanel,
  type DisclosurePanelProps as AriaDisclosurePanelProps,
  type DisclosureProps as AriaDisclosureProps,
  Button,
  type ButtonProps,
  Heading,
  composeRenderProps,
} from 'react-aria-components';

import { ChevronDown, Kebab } from '@/icons';
import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'cva';
import { Children, cloneElement, isValidElement } from 'react';
import { IconButton } from '../icon-button';

const accordionStyles = cva('group flex flex-col bg-transparent', {
  variants: {
    variant: {
      cozy: 'is-cozy',
      compact: 'is-compact',
    },
  },
  defaultVariants: {
    variant: 'cozy',
  },
});

export interface AccordionProps
  extends AriaDisclosureProps,
    VariantProps<typeof accordionStyles> {
  children: React.ReactNode;
  options?: boolean;
}

export function Accordion({
  children,
  className,
  options = false,
  variant,
  ...props
}: AccordionProps) {
  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { options, variant } as AccordionProps);
    }
    return child;
  });

  return (
    <AriaDisclosure
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          `group w-full ${options ? 'has-options' : ''}`,
          accordionStyles({ variant, className }),
        ),
      )}
    >
      {childrenWithProps}
    </AriaDisclosure>
  );
}

export interface AccordionHeaderProps
  extends Pick<AccordionProps, 'options' | 'variant'> {
  children: React.ReactNode;
  className?: ButtonProps['className'];
}

export function AccordionHeader({
  children,
  options,
  variant,
}: AccordionHeaderProps) {
  return (
    <Heading>
      <Button
        slot='trigger'
        className='fg-default-light group-[.is-cozy]:icon-size-xl group-[.is-compact]:icon-size-l flex w-full cursor-pointer items-center rounded-medium transition-colors hover:bg-interactive-hover-dark group-[.is-compact]:gap-xs group-[.is-cozy]:gap-s group-[.is-compact]:p-s group-[.is-cozy]:p-s group-[.is-compact]:text-header-s group-[.is-cozy]:text-header-m'
      >
        <span
          className={IconButton.as({
            size: variant === 'cozy' ? 'medium' : 'small',
          })}
        >
          <ChevronDown
            aria-hidden
            className={cn('transform group-ai-expanded:rotate-180')}
          />
        </span>
        {children}
        {options && (
          <IconButton
            size={variant === 'cozy' ? 'medium' : 'small'}
            className='ml-auto'
          >
            <Kebab />
          </IconButton>
        )}
      </Button>
    </Heading>
  );
}

export interface AccordionPanelProps extends AriaDisclosurePanelProps {
  children: React.ReactNode;
}

export function AccordionPanel({
  children,
  className,
  ...props
}: AccordionPanelProps) {
  return (
    <AriaDisclosurePanel
      {...props}
      className={'overflow-hidden transition-all'}
    >
      <div className={cn('p-s', className)}>{children}</div>
    </AriaDisclosurePanel>
  );
}

export interface AccordionGroupProps extends AriaDisclosureGroupProps {
  children: React.ReactNode;
}

export function AccordionGroup({
  children,
  className,
  ...props
}: AccordionGroupProps) {
  return (
    <AriaDisclosureGroup
      {...props}
      className={composeRenderProps(className, (className) =>
        cn('flex w-full flex-col', className),
      )}
    >
      {children}
    </AriaDisclosureGroup>
  );
}
