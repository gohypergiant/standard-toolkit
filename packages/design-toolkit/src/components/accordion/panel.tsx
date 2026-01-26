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
import { composeRenderProps, DisclosurePanel } from 'react-aria-components';
import styles from './styles.module.css';
import type { AccordionPanelProps } from './types';

/**
 * Content panel component for accordion sections.
 *
 * Wraps collapsible content that is shown or hidden when the
 * corresponding accordion trigger is activated.
 *
 * @param props - The accordion panel props.
 * @param props.ref - Reference to the panel div element.
 * @param props.children - Content to display within the panel.
 * @param props.className - Additional CSS class names for styling.
 * @returns The accordion panel component.
 *
 * @example
 * ```tsx
 * <Accordion>
 *   <AccordionHeader>
 *     <AccordionTrigger>Details</AccordionTrigger>
 *   </AccordionHeader>
 *   <AccordionPanel>
 *     <p>This content is collapsible.</p>
 *   </AccordionPanel>
 * </Accordion>
 * ```
 */
export function AccordionPanel({
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
        clsx(styles.panel, className),
      )}
    >
      {children}
    </DisclosurePanel>
  );
}
