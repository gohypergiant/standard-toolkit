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
import { Radio as AriaRadio, composeRenderProps } from 'react-aria-components';
import styles from './styles.module.css';
import type { RadioProps } from './types';

/**
 * Radio - Individual radio button option within a RadioGroup
 *
 * Renders a selectable radio button with label. Must be used inside a RadioGroup.
 *
 * @example
 * ```tsx
 * <RadioGroup label="Favorite color">
 *   <Radio value="red">Red</Radio>
 *   <Radio value="blue">Blue</Radio>
 * </RadioGroup>
 * ```
 */
export function Radio({ classNames, children, ...rest }: RadioProps) {
  return (
    <AriaRadio
      {...rest}
      className={composeRenderProps(classNames?.radio, (className) =>
        clsx('group/radio', styles.radio, className),
      )}
    >
      {composeRenderProps(children, (children) => (
        <>
          <span className={clsx(styles.control, classNames?.control)} />
          <span className={clsx(styles.label, classNames?.label)}>
            {children}
          </span>
        </>
      ))}
    </AriaRadio>
  );
}
