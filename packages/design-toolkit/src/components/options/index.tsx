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
  ListBox,
  useContextProps,
} from 'react-aria-components';
import { OptionsContext } from './context';
import { OptionsStyles } from './styles';
import type { OptionsDataItem, OptionsProps } from './types';

const { list } = OptionsStyles();

/**
 * Options - A flexible list component for selectable items with rich content
 *
 * Provides accessible list functionality with support for selection, sections,
 * and rich item content including labels, descriptions, and icons. Perfect for
 * dropdown lists, menu items, or any selectable list interface.
 *
 * @example
 * // Basic options list
 * <Options>
 *   <OptionsItem>
 *     <OptionsItemLabel>Option 1</OptionsItemLabel>
 *   </OptionsItem>
 *   <OptionsItem>
 *     <OptionsItemLabel>Option 2</OptionsItemLabel>
 *   </OptionsItem>
 * </Options>
 *
 * @example
 * // Options with descriptions and icons
 * <Options>
 *   <OptionsItem>
 *     <Icon><User /></Icon>
 *     <OptionsItemContent>
 *       <OptionsItemLabel>John Doe</OptionsItemLabel>
 *       <OptionsItemDescription>Senior Developer</OptionsItemDescription>
 *     </OptionsItemContent>
 *   </OptionsItem>
 * </Options>
 *
 * @example
 * // Sectioned options
 * <Options>
 *   <OptionsSection header="Recent">
 *     <OptionsItem>Recent Item 1</OptionsItem>
 *   </OptionsSection>
 *   <OptionsSection header="All Items">
 *     <OptionsItem>All Items 1</OptionsItem>
 *   </OptionsSection>
 * </Options>
 */
export function Options<T extends OptionsDataItem>({
  ref,
  ...props
}: OptionsProps<T>) {
  [props, ref] = useContextProps(props, ref ?? null, OptionsContext);

  const { children, className, size, ...rest } = props;

  return (
    <ListBox<T>
      {...rest}
      ref={ref}
      className={composeRenderProps(className, (className) =>
        list({ className }),
      )}
      data-size={size}
    >
      {children}
    </ListBox>
  );
}
