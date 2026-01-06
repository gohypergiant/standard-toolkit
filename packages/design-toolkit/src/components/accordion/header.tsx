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
import { Kebab } from '@accelint/icons';
import { useContext } from 'react';
import { Header, Provider } from 'react-aria-components';
import { isSlottedContextValue } from '../../lib/utils';
import { ButtonContext } from '../button/context';
import { Icon } from '../icon';
import { IconContext } from '../icon/context';
import { AccordionContext } from './context';
import styles from './styles.module.css';
import type { AccordionHeaderProps } from './types';

export function AccordionHeader({
  ref,
  children,
  className,
}: AccordionHeaderProps) {
  const context = useContext(AccordionContext);
  const variant =
    (isSlottedContextValue(context) ? undefined : context?.variant) ?? 'cozy';
  const isDisabled =
    (isSlottedContextValue(context) ? undefined : context?.isDisabled) ?? false;

  return (
    <Provider
      values={[
        [IconContext, { size: variant === 'compact' ? 'small' : 'large' }],
        [
          ButtonContext,
          {
            children: (
              <Icon>
                <Kebab />
              </Icon>
            ),
            variant: 'icon',
            isDisabled,
            className: styles.menu,
          },
        ],
      ]}
    >
      <Header ref={ref} className={clsx(styles.header, className)}>
        {children}
      </Header>
    </Provider>
  );
}
