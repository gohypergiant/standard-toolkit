// __private-exports
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
import CancelFill from '@accelint/icons/cancel-fill';
import {
  type ButtonProps as AriaButtonProps,
  Button,
  composeRenderProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import styles from './clear.module.css';

/**
 * ClearButton - Internal-only button for clearing input values
 *
 * A lightweight button component used internally by input
 * components to provide clear functionality. This component is not exported
 * from the design-toolkit package and should not be used directly by consumers.
 *
 * @internal
 */
export type ClearButtonProps = Omit<
  AriaButtonProps,
  'children' | 'size' | 'variant'
> & {
  /** Optional className for additional styling */
  className?: AriaButtonProps['className'];
};

/**
 * @internal
 */
export function ClearButton({ className, ...rest }: ClearButtonProps) {
  return (
    <Button
      {...rest}
      excludeFromTabOrder
      className={composeRenderProps(className, (className) =>
        clsx(styles.clearButton, className),
      )}
    >
      <Icon>
        <CancelFill />
      </Icon>
    </Button>
  );
}
