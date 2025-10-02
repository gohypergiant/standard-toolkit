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

export type BreadcrumbItemProps = Omit<
  BreadcrumbProps,
  'children' | 'className'
> &
  (
    | {
        classNames?: {
          item?: BreadcrumbProps['className'];
          link?: LinkProps['className'];
          separator?: string;
        };
        linkProps: Omit<LinkProps, 'className'>;
        children?: LinkProps['children'];
      }
    | {
        classNames?: {
          item?: BreadcrumbProps['className'];
          separator?: string;
        };
        linkProps?: never;
        children?: BreadcrumbProps['children'];
      }
  );
