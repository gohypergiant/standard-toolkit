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
  DisclosureGroupStateContext as AriaDisclosureGroupStateContext,
  DisclosurePanel as AriaDisclosurePanel,
  type DisclosurePanelProps as AriaDisclosurePanelProps,
  type DisclosureProps as AriaDisclosureProps,
  Button,
  type ButtonProps,
  Heading,
} from 'react-aria-components';

import { cn } from '@/lib/utils';
import { ChevronDown, Kebab } from '@accelint/icons';
import { type VariantProps, cva } from 'cva';
import { createContext, useContext } from 'react';
import { Icon } from '../icon';
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

interface AccordionContextType
  extends Pick<VariantProps<typeof accordionStyles>, 'variant'> {
  isDisabled?: boolean;
  options?: boolean;
}

const AccordionContext = createContext<AccordionContextType>({
  isDisabled: false,
  options: false,
  variant: 'cozy',
});

export interface AccordionProps
  extends VariantProps<typeof accordionStyles>,
    AriaDisclosureProps {
  options?: boolean;
}

export function Accordion({
  children,
  className,
  isDisabled = false,
  options = false,
  variant = 'cozy',
  ...props
}: AccordionProps) {
  // @ts-expect-error package version mismatch
  const stateContext = useContext(AriaDisclosureGroupStateContext);

  return (
    <AccordionContext.Provider
      value={{
        options,
        variant,
        isDisabled: isDisabled || stateContext?.isDisabled,
      }}
    >
      <AriaDisclosure
        {...props}
        isDisabled={isDisabled}
        className={cn(
          `group w-full ${options ? 'has-options' : ''}`,
          accordionStyles({ variant, className }),
        )}
      >
        {(props) =>
          typeof children === 'function' ? children(props) : children
        }
      </AriaDisclosure>
    </AccordionContext.Provider>
  );
}
Accordion.displayName = 'Accordion';

export interface AccordionHeaderProps
  extends Pick<AccordionProps, 'options' | 'variant'> {
  children: React.ReactNode;
  className?: ButtonProps['className'];
  isDisabled?: boolean;
}

function AccordionHeader({ children }: AccordionHeaderProps) {
  const { isDisabled, options, variant } = useContext(AccordionContext);

  return (
    <Heading
      className={cn([
        'fg-default-light flex w-full cursor-pointer items-center rounded-medium p-s outline-none focus-within:bg-interactive-hover-dark hover:bg-interactive-hover-dark',
        isDisabled &&
          'fg-disabled cursor-default focus-within:bg-transparent hover:bg-transparent',
      ])}
      data-variant={variant}
    >
      <Button
        slot='trigger'
        className={cn([
          'flex w-full cursor-pointer items-center rounded-medium outline-none',
          'data-[variant=cozy]:icon-size-xl data-[variant=cozy]:gap-s data-[variant=cozy]:text-header-m',
          'data-[variant=compact]:icon-size-l data-[variant=compact]:gap-xs data-[variant=compact]:text-header-s',
          'ai-disabled:cursor-default',
        ])}
        data-variant={variant}
      >
        {/* @ts-expect-error package version mismatch */}
        <span
          className={IconButton.as({
            isDisabled,
            size: variant === 'cozy' ? 'medium' : 'small',
            variant: 'child',
          })}
          aria-hidden
        >
          <Icon>
            <ChevronDown
              className={cn('transform group-ai-expanded:rotate-180')}
            />
          </Icon>
        </span>
        {children}
      </Button>
      {options && (
        <IconButton
          className='ml-auto'
          isDisabled={isDisabled}
          size={variant === 'cozy' ? 'medium' : 'small'}
          variant='child'
        >
          <Icon>
            <Kebab />
          </Icon>
        </IconButton>
      )}
    </Heading>
  );
}
AccordionHeader.displayName = 'Accordion.Header';
Accordion.Header = AccordionHeader;

export interface AccordionPanelProps extends AriaDisclosurePanelProps {}

function AccordionPanel({
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
AccordionPanel.displayName = 'Accordion.Panel';
Accordion.Panel = AccordionPanel;

export interface AccordionGroupProps extends AriaDisclosureGroupProps {
  /** Whether multiple items can be expanded at the same time. */
  allowsMultipleExpanded?: boolean;
}

function AccordionGroup({
  allowsMultipleExpanded = false,
  children,
  className,
  ...props
}: AccordionGroupProps) {
  return (
    <AriaDisclosureGroup
      {...props}
      allowsMultipleExpanded={allowsMultipleExpanded}
      className={cn('flex w-full flex-col', className)}
    >
      {(props) => (typeof children === 'function' ? children(props) : children)}
    </AriaDisclosureGroup>
  );
}
AccordionGroup.displayName = 'Accordion.Group';
Accordion.Group = AccordionGroup;
