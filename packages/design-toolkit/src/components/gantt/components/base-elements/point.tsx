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

import { clsx } from '@accelint/design-foundation/lib/utils';
import { type HTMLAttributes, type PropsWithChildren, useState } from 'react';
import { GANTT_ROW_ELEMENT_HEIGHT } from '../../constants';
import { usePointElementLayout } from '../base-elements/use-point-element-layout';
import styles from './styles.module.css';

export type PointProps = HTMLAttributes<HTMLDivElement> & {
  timeMs: number;
  className?: string;
};

export function Point({
  timeMs,
  className,
  children,
  ...rest
}: PropsWithChildren<PointProps>) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  usePointElementLayout({
    element,
    timeMs,
  });

  const assignElementRef = (node: HTMLDivElement) => {
    setElement(node);
  };

  return (
    <div
      ref={assignElementRef}
      className={clsx(styles['bracket-container'], className)}
      data-height={GANTT_ROW_ELEMENT_HEIGHT}
      {...rest}
    >
      {children}
    </div>
  );
}
