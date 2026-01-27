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

import { clsx } from '@accelint/design-foundation/lib/utils';
import { Collection, Header, ListBoxSection } from 'react-aria-components';
import styles from './styles.module.css';
import type { OptionsDataItem, OptionsSectionProps } from './types';

/**
 * OptionsSection - Groups related options with an optional header
 *
 * @example
 * ```tsx
 * <OptionsSection header="Recent">
 *   <OptionsItem>Item 1</OptionsItem>
 *   <OptionsItem>Item 2</OptionsItem>
 * </OptionsSection>
 * ```
 *
 * @param props - {@link OptionsSectionProps}
 * @param props.children - Options items to render in the section.
 * @param props.classNames - CSS class names for section elements.
 * @param props.header - Header text for the section.
 * @param props.items - Collection of items for dynamic rendering.
 * @returns The rendered OptionsSection component.
 */
export function OptionsSection<T extends OptionsDataItem>({
  children,
  classNames,
  header,
  items,
}: OptionsSectionProps<T>) {
  return (
    <ListBoxSection
      id={header}
      className={clsx(styles.section, classNames?.section)}
    >
      <Header className={clsx(styles.header, classNames?.header)}>
        {header}
      </Header>
      <Collection items={items}>{children}</Collection>
    </ListBoxSection>
  );
}
