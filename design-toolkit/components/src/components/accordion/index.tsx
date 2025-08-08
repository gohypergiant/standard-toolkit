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
import { ChevronDown, Kebab } from '@accelint/icons';
import { createContext, useContext } from 'react';
import {
  type ContextValue,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Header,
  Heading,
  Provider,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Button, ButtonContext } from '../button';
import { Icon, IconContext } from '../icon';
import { AccordionStyles, AccordionStylesDefaults } from './styles';
import type {
  AccordionGroupProps,
  AccordionHeaderProps,
  AccordionPanelProps,
  AccordionProps,
  AccordionTriggerProps,
} from './types';

const { group, accordion, header, heading, trigger, panel } = AccordionStyles();

export const AccordionContext =
  createContext<ContextValue<AccordionProps, HTMLDivElement>>(null);

function AccordionGroup({
  ref,
  children,
  className,
  variant = AccordionStylesDefaults.variant,
  isDisabled,
  ...rest
}: AccordionGroupProps) {
  return (
    <AccordionContext.Provider value={{ variant, isDisabled }}>
      <DisclosureGroup
        {...rest}
        ref={ref}
        className={composeRenderProps(className, (className) =>
          group({
            className,
            variant,
          }),
        )}
      >
        {children}
      </DisclosureGroup>
    </AccordionContext.Provider>
  );
}
AccordionGroup.displayName = 'Accordion.Group';

function AccordionHeader({ ref, children, className }: AccordionHeaderProps) {
  const context = useContext(AccordionContext);
  const variant =
    (isSlottedContextValue(context) ? undefined : context?.variant) ??
    AccordionStylesDefaults.variant;
  const isDisabled =
    (isSlottedContextValue(context) ? undefined : context?.isDisabled) ?? false;

  return (
    <Provider
      values={[
        [IconContext, { size: variant === 'compact' ? 'small' : 'large' }],
        [
          ButtonContext,
          {
            children: (
              <Icon>
                <Kebab />
              </Icon>
            ),
            variant: 'icon',
            isDisabled,
          },
        ],
      ]}
    >
      <Header
        ref={ref}
        className={header({
          className,
          variant,
        })}
      >
        {children}
      </Header>
    </Provider>
  );
}
AccordionHeader.displayName = 'Accordion.Header';

function AccordionTrigger({
  ref,
  children,
  classNames,
}: AccordionTriggerProps) {
  const context = useContext(AccordionContext);
  const variant =
    (isSlottedContextValue(context) ? undefined : context?.variant) ??
    AccordionStylesDefaults.variant;

  return (
    <Heading
      ref={ref}
      className={heading({
        className: classNames?.heading,
        variant,
      })}
    >
      <Button
        slot='trigger'
        className={composeRenderProps(classNames?.trigger, (className) =>
          trigger({
            className,
            variant,
          }),
        )}
        variant='flat'
      >
        <Icon>
          <ChevronDown className='transform group-expanded/accordion:rotate-180' />
        </Icon>
        {children}
      </Button>
    </Heading>
  );
}
AccordionTrigger.displayName = 'Accordion.Trigger';

function AccordionPanel({
  ref,
  children,
  className,
  ...rest
}: AccordionPanelProps) {
  return (
    <DisclosurePanel
      {...rest}
      ref={ref}
      className={composeRenderProps(className, (className) =>
        panel({ className }),
      )}
    >
      {children}
    </DisclosurePanel>
  );
}
AccordionPanel.displayName = 'Accordion.Panel';

/**
 * Accordion - A collapsible content component with expandable sections
 *
 * Provides an accessible accordion interface for organizing content into
 * collapsible sections. Supports both compact and full variants with
 * integrated controls for expanding/collapsing content areas.
 *
 * @example
 * // Basic accordion
 * <Accordion>
 *   <Accordion.Header>
 *     <Accordion.Trigger>Section Title</Accordion.Trigger>
 *   </Accordion.Header>
 *   <Accordion.Panel>Content goes here</Accordion.Panel>
 * </Accordion>
 *
 * @example
 * // Compact variant
 * <Accordion variant="compact">
 *   <Accordion.Header>
 *     <Accordion.Trigger>Compact Section</Accordion.Trigger>
 *   </Accordion.Header>
 *   <Accordion.Panel>Compact content</Accordion.Panel>
 * </Accordion>
 *
 * @example
 * // Multiple accordions in a group
 * <Accordion.Group>
 *   <Accordion>
 *     <Accordion.Header>
 *       <Accordion.Trigger>First Section</Accordion.Trigger>
 *     </Accordion.Header>
 *     <Accordion.Panel>First content</Accordion.Panel>
 *   </Accordion>
 *   <Accordion>
 *     <Accordion.Header>
 *       <Accordion.Trigger>Second Section</Accordion.Trigger>
 *     </Accordion.Header>
 *     <Accordion.Panel>Second content</Accordion.Panel>
 *   </Accordion>
 * </Accordion.Group>
 */
export function Accordion({ ref, ...props }: AccordionProps) {
  [props, ref] = useContextProps(props, ref ?? null, AccordionContext);

  const {
    children,
    className,
    variant = AccordionStylesDefaults.variant,
    isDisabled,
    ...rest
  } = props;

  return (
    <AccordionContext.Provider
      value={{
        variant,
        isDisabled,
      }}
    >
      <Disclosure
        {...rest}
        className={composeRenderProps(className, (className) =>
          accordion({
            className,
          }),
        )}
        isDisabled={isDisabled}
      >
        {children}
      </Disclosure>
    </AccordionContext.Provider>
  );
}
Accordion.displayName = 'Accordion';
Accordion.Group = AccordionGroup;
Accordion.Header = AccordionHeader;
Accordion.Trigger = AccordionTrigger;
Accordion.Panel = AccordionPanel;
