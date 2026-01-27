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

import type { BreadcrumbProps, LinkProps } from 'react-aria-components';

/**
 * Props for the BreadcrumbItem component.
 *
 * Discriminated union: when `linkProps` is provided, renders as a navigable link;
 * otherwise renders as plain text representing the current page.
 */
export type BreadcrumbItemProps = Omit<
  BreadcrumbProps,
  'children' | 'className'
> &
  (
    | {
        /** Custom class names for breadcrumb sub-elements. */
        classNames?: {
          /** Class name for the breadcrumb item wrapper. */
          item?: BreadcrumbProps['className'];
          /** Class name for the link element. */
          link?: LinkProps['className'];
          /** Class name for the separator icon. */
          separator?: string;
        };
        /** Props for the Link component. When provided, item renders as a link. */
        linkProps: Omit<LinkProps, 'className'>;
        /** Content to display in the link. */
        children?: LinkProps['children'];
      }
    | {
        /** Custom class names for breadcrumb sub-elements. */
        classNames?: {
          /** Class name for the breadcrumb item wrapper. */
          item?: BreadcrumbProps['className'];
          /** Class name for the separator icon. */
          separator?: string;
        };
        /** Must be omitted for current page items. */
        linkProps?: never;
        /** Content to display for the current page. */
        children?: BreadcrumbProps['children'];
      }
  );
