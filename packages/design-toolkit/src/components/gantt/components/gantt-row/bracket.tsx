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

import { type CSSProperties, useState } from 'react';
import { GANTT_BLOCK_HEIGHT_PX } from '../../constants';
import styles from './styles.module.css';
import { usePointElementLayout } from './use-point-element-layout';

type BracketBaseProps = {
  direction: 'open' | 'close';
  timeMs: number;
};

function BracketBase({ direction, timeMs }: BracketBaseProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const rotate = direction === 'open' ? '0' : '180';

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
      className={styles['bracket-container']}
      style={
        {
          '--rotate': `${rotate}deg`,
          height: `${GANTT_BLOCK_HEIGHT_PX}px`,
        } as CSSProperties
      }
    >
      <div
        style={{ height: `${GANTT_BLOCK_HEIGHT_PX}px` }}
        className={styles.bracket}
      />
    </div>
  );
}

type BracketProps = {
  timeMs: number;
};

export function OpenBracket(props: BracketProps) {
  return <BracketBase direction='open' {...props} />;
}

export function CloseBracket(props: BracketProps) {
  return <BracketBase direction='close' {...props} />;
}
