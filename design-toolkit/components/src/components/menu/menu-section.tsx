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
  MenuSection as AriaMenuSection,
  Collection,
  Header,
} from 'react-aria-components';
import { MenuStyles } from './styles';
import type { MenuSectionProps } from './types';

const { section, header } = MenuStyles();

export function MenuSection<T extends object>({
  children,
  classNames,
  items,
  title,
  ...rest
}: MenuSectionProps<T>) {
  return (
    <AriaMenuSection
      {...rest}
      className={section({ className: classNames?.section })}
    >
      {title && (
        <Header className={header({ className: classNames?.header })}>
          {title}
        </Header>
      )}
      <Collection items={items}>{children}</Collection>
    </AriaMenuSection>
  );
}
