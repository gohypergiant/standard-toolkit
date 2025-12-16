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
import { ChevronDown } from '@accelint/icons';
import { useContext } from 'react';
import { composeRenderProps, Heading } from 'react-aria-components';
import { isSlottedContextValue } from '../../lib/utils';
import { Button } from '../button';
import { Icon } from '../icon';
import { IconContext } from '../icon/context';
import { AccordionContext } from './context';
import styles from './styles.module.css';
import type { AccordionTriggerProps } from './types';

export function AccordionTrigger({
  ref,
  children,
  classNames,
}: AccordionTriggerProps) {
  const context = useContext(AccordionContext);
  const variant =
    (isSlottedContextValue(context) ? undefined : context?.variant) ?? 'cozy';

  return (
    <Heading ref={ref} className={clsx(styles.heading, classNames?.heading)}>
      <Button
        slot='trigger'
        className={composeRenderProps(classNames?.trigger, (className) =>
          clsx(styles.trigger, styles[variant], className),
        )}
        variant='flat'
      >
        <IconContext.Provider
          value={{ size: variant === 'compact' ? 'small' : 'medium' }}
        >
          <Icon>
            <ChevronDown className={styles.triggerChevron} />
          </Icon>
          {children}
        </IconContext.Provider>
      </Button>
    </Heading>
  );
}
