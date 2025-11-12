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
  composeRenderProps,
  Disclosure,
  useContextProps,
} from 'react-aria-components';
import { AccordionContext } from './context';
import { AccordionStyles, AccordionStylesDefaults } from './styles';
import type { AccordionProps } from './types';

const { accordion } = AccordionStyles();

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
 *   <AccordionHeader>
 *     <AccordionTrigger>Section Title</AccordionTrigger>
 *   </AccordionHeader>
 *   <AccordionPanel>Content goes here</AccordionPanel>
 * </Accordion>
 *
 * @example
 * // Compact variant
 * <Accordion variant="compact">
 *   <AccordionHeader>
 *     <AccordionTrigger>Compact Section</AccordionTrigger>
 *   </AccordionHeader>
 *   <AccordionPanel>Compact content</AccordionPanel>
 * </Accordion>
 *
 * @example
 * // Multiple accordions in a group
 * <AccordionGroup>
 *   <Accordion>
 *     <AccordionHeader>
 *       <AccordionTrigger>First Section</AccordionTrigger>
 *     </AccordionHeader>
 *     <AccordionPanel>First content</AccordionPanel>
 *   </Accordion>
 *   <Accordion>
 *     <AccordionHeader>
 *       <AccordionTrigger>Second Section</AccordionTrigger>
 *     </AccordionHeader>
 *     <AccordionPanel>Second content</AccordionPanel>
 *   </Accordion>
 * </AccordionGroup>
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
