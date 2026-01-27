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

import type { ComponentPropsWithRef } from 'react';
import type { ButtonProps, ToggleButtonProps } from '../button/types';

/**
 * Context value for pagination state shared with sub-components.
 */
export type PaginationContextValue = {
  /** Current page number (1-indexed). */
  page: number;
  /** Total number of pages. */
  total: number;
  /** Whether the pagination is in a loading state. */
  isLoading?: boolean;
  /** Function to update the current page. */
  setPage: (page: number) => void;
};

/**
 * Props for the Pagination component.
 */
export type PaginationProps = Omit<
  ComponentPropsWithRef<'nav'>,
  'className' | 'onChange'
> & {
  /** CSS class names for pagination elements. */
  classNames?: {
    /** Class name for the nav container. */
    container?: string;
    /** Class name for the previous button. */
    prev?: ButtonProps['className'];
    /** Class name for the page number buttons. */
    pages?: ToggleButtonProps['className'];
    /** Class name for the next button. */
    next?: ButtonProps['className'];
  };
  /** Total number of pages. */
  total: number;
  /** Default page number for uncontrolled mode. */
  defaultValue?: number;
  /** Current page number for controlled mode. */
  value?: number;
  /** Whether the pagination is in a loading state. */
  isLoading?: boolean;
  /** Handler called when the page changes. */
  onChange?: (page: number) => void;
};

/**
 * Props for the PaginationPages component.
 */
export type PaginationPagesProps = Pick<ToggleButtonProps, 'className'> & {
  /** Handler called when a page button is pressed. */
  onPress?: (page: number) => void;
};

/**
 * Props for the PaginationPrev component.
 */
export type PaginationPrevProps = Pick<ButtonProps, 'className'> & {
  /** Handler called when the previous button is pressed. */
  onPress?: (page: number) => void;
};

/**
 * Props for the PaginationNext component.
 */
export type PaginationNextProps = Pick<ButtonProps, 'className'> & {
  /** Handler called when the next button is pressed. */
  onPress?: (page: number) => void;
};
