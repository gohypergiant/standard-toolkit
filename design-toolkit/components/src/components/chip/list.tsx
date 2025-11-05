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
import { createContext } from 'react';
import {
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { ChipContext, ChipProvider } from './context';
import { ChipStyles } from './styles';
import type { ChipListProps } from './types';

const { list } = ChipStyles();

export const ChipListRenderingContext = createContext(false);

export function ChipList<T extends object>({
  ref,
  ...props
}: ChipListProps<T>) {
  [props, ref] = useContextProps(props, ref ?? null, ChipContext);

  const {
    children,
    className,
    dependencies,
    items,
    renderEmptyState,
    size = 'small',
    ...rest
  } = props;

  return (
    <ChipListRenderingContext.Provider value>
      <ChipProvider size={size}>
        <AriaTagGroup {...rest}>
          <AriaTagList<T>
            ref={ref}
            className={composeRenderProps(className, (className) =>
              list({ className }),
            )}
            dependencies={dependencies}
            items={items}
            renderEmptyState={renderEmptyState}
          >
            {children}
          </AriaTagList>
        </AriaTagGroup>
      </ChipProvider>
    </ChipListRenderingContext.Provider>
  );
}
