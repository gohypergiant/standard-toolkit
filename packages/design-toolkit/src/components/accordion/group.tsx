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
import { clsx } from '@accelint/design-foundation/lib/utils';
import { composeRenderProps, DisclosureGroup } from 'react-aria-components';
import { AccordionContext } from './context';
import styles from './styles.module.css';
import type { AccordionGroupProps } from './types';

/**
 * Container component for grouping multiple accordions with shared configuration.
 *
 * Provides coordinated behavior for multiple accordions, controlling
 * whether multiple sections can be expanded simultaneously.
 *
 * Wraps react-aria-components DisclosureGroup and provides variant context.
 *
 * @param props - The accordion group props.
 * @param props.ref - Reference to the root div element.
 * @param props.children - Accordion components to render within the group.
 * @param props.className - Additional CSS class names for styling.
 * @param props.variant - Visual variant of the accordions ('compact' or 'cozy').
 * @param props.isDisabled - Whether all accordions in the group are disabled.
 * @returns The accordion group component.
 *
 * @example
 * ```tsx
 * <AccordionGroup variant="compact">
 *   <Accordion>
 *     <AccordionHeader>
 *       <AccordionTrigger>Section 1</AccordionTrigger>
 *     </AccordionHeader>
 *     <AccordionPanel>Content 1</AccordionPanel>
 *   </Accordion>
 *   <Accordion>
 *     <AccordionHeader>
 *       <AccordionTrigger>Section 2</AccordionTrigger>
 *     </AccordionHeader>
 *     <AccordionPanel>Content 2</AccordionPanel>
 *   </Accordion>
 * </AccordionGroup>
 * ```
 */
export function AccordionGroup({
  ref,
  children,
  className,
  variant = 'cozy',
  isDisabled,
  ...rest
}: AccordionGroupProps) {
  return (
    <AccordionContext.Provider value={{ variant, isDisabled }}>
      <DisclosureGroup
        {...rest}
        ref={ref}
        className={composeRenderProps(className, (className) =>
          clsx('group/accordion-group', styles.group, className),
        )}
      >
        {children}
      </DisclosureGroup>
    </AccordionContext.Provider>
  );
}
