/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { useContext } from 'react';
import { clsx } from '@accelint/design-foundation/lib/utils';
import { ComboBoxStateContext, Text } from 'react-aria-components';
import styles from './styles.module.css';
import type { ReactNode } from 'react';
import type { TextProps } from 'react-aria-components';

/**
 * OptionsItemLabel - Primary text label for an options item
 *
 * @example
 * ```tsx
 * <OptionsItemLabel>Option Name</OptionsItemLabel>
 * ```
 *
 * @param props - TextProps from react-aria-components.
 * @param props.className - Optional CSS class name.
 * @returns The rendered OptionsItemLabel component.
 */
export function OptionsItemLabel({ className, children, ...rest }: TextProps) {
  const comboBoxState = useContext(ComboBoxStateContext);
  const inputValue = comboBoxState?.inputValue ?? '';

  const highlighted =
    typeof children === 'string' && inputValue
      ? highlightMatch(children, inputValue)
      : children;

  return (
    <Text {...rest} slot='label' className={clsx(styles.label, className)}>
      {highlighted}
    </Text>
  );
}

function highlightMatch(text: string, query: string): ReactNode {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className={styles.highlight}>
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}
