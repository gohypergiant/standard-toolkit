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

import type { ComponentPropsWithRef, RefAttributes } from 'react';
import type {
  ButtonRenderProps,
  DisclosureGroupProps,
  DisclosurePanelProps,
  DisclosureProps,
  Heading,
} from 'react-aria-components';
import type { RenderPropsClassName } from '@/lib/types';

/**
 * Style variant options for accordion components.
 */
export type AccordionStyleVariants = {
  /** Visual density variant: 'compact' for dense layouts, 'cozy' for spacious layouts. */
  variant?: 'compact' | 'cozy';
};

/**
 * Props for the AccordionGroup component.
 *
 * Extends DisclosureGroup props with accordion-specific styling options.
 */
export type AccordionGroupProps = DisclosureGroupProps &
  AccordionStyleVariants &
  RefAttributes<HTMLDivElement>;

/**
 * Props for the Accordion component.
 *
 * Extends Disclosure props with accordion-specific styling options.
 */
export type AccordionProps = DisclosureProps &
  AccordionStyleVariants &
  RefAttributes<HTMLDivElement>;

/**
 * Props for the AccordionHeader component.
 *
 * Standard HTML header element props with ref support.
 */
export type AccordionHeaderProps = ComponentPropsWithRef<'header'>;

/**
 * Props for the AccordionTrigger component.
 *
 * Extends Heading component props with custom className support for
 * both the heading wrapper and the trigger button.
 */
export type AccordionTriggerProps = Omit<
  ComponentPropsWithRef<typeof Heading>,
  'className'
> & {
  /** Custom class names for sub-elements. */
  classNames?: {
    /** Class name for the heading wrapper element. */
    heading?: string;
    /** Class name or render props function for the trigger button. */
    trigger?: RenderPropsClassName<ButtonRenderProps>;
  };
};

/**
 * Props for the AccordionPanel component.
 *
 * Extends DisclosurePanel props with ref support for the panel element.
 */
export type AccordionPanelProps = DisclosurePanelProps &
  RefAttributes<HTMLDivElement>;
