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
import {
  MenuSection as AriaMenuSection,
  Collection,
  Header,
} from 'react-aria-components';
import styles from './styles.module.css';
import type { MenuSectionProps } from './types';

/**
 * MenuSection - Groups related menu items with an optional header
 *
 * Use to organize menu items into logical groups with visual separation.
 *
 * @example
 * <MenuSection title="File Actions">
 *   <MenuItem>New</MenuItem>
 *   <MenuItem>Open</MenuItem>
 * </MenuSection>
 *
 * @param props - {@link MenuSectionProps}
 * @param props.children - Menu items to render in the section.
 * @param props.classNames - CSS class names for section elements.
 * @param props.items - Collection of items for dynamic rendering.
 * @param props.title - Title displayed in the section header.
 * @returns The rendered MenuSection component.
 */
export function MenuSection<T extends object>({
  children,
  classNames,
  items,
  title,
  ...rest
}: MenuSectionProps<T>) {
  return (
    <AriaMenuSection {...rest} className={classNames?.section}>
      {title && (
        <Header className={clsx(styles.header, classNames?.header)}>
          {title}
        </Header>
      )}
      <Collection items={items}>{children}</Collection>
    </AriaMenuSection>
  );
}
