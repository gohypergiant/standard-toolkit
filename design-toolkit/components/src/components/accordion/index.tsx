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
  Button,
  type ContextValue,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';

import { isSlottedContextValue } from '@/lib/utils';
import { ChevronDown } from '@accelint/icons';
import { createContext, useContext } from 'react';
import { Icon } from '../icon';
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

  return (
    <Icon.Provider size={variant === 'compact' ? 'small' : 'large'}>
      <div
        ref={ref}
        className={header({
          className,
          variant,
        })}
      >
        {children}
      </div>
    </Icon.Provider>
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
