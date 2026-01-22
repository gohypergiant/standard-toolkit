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
  Switch as AriaSwitch,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { SwitchContext } from './context';
import styles from './styles.module.css';
import type { SwitchProps } from './types';

/**
 * Switch - Toggle control for binary on/off states
 *
 * Provides visual feedback with smooth transitions and accessible keyboard/screen reader support.
 */
export function Switch({ ref, ...props }: SwitchProps) {
  [props, ref] = useContextProps(props, ref ?? null, SwitchContext);

  const { children, classNames, labelPosition = 'end', ...rest } = props;

  return (
    <AriaSwitch
      {...rest}
      ref={ref}
      className={composeRenderProps(classNames?.switch, (className) =>
        clsx('group/switch', styles.switch, styles[labelPosition], className),
      )}
    >
      {composeRenderProps(children, (children) => (
        <>
          <span className={clsx(styles.control, classNames?.control)} />
          {children != null && (
            <span className={clsx(styles.label, classNames?.label)}>
              {children}
            </span>
          )}
        </>
      ))}
    </AriaSwitch>
  );
}
