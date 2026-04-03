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

import { Point, type PointProps } from '../base-elements/point';
import styles from './styles.module.css';
import { useIsElapsed } from './use-is-elapsed';

type BracketBaseProps = PointProps & {
  direction: 'open' | 'close';
};

function BracketBase({ direction, ...rest }: BracketBaseProps) {
  const isElapsed = useIsElapsed({ timeMs: rest.timeMs });
  const rotate = direction === 'open' ? '0' : '180';

  return (
    <Point
      className={styles['bracket-container']}
      data-rotate={rotate}
      data-elapsed={isElapsed || undefined}
      {...rest}
    >
      <div className={styles.bracket} />
    </Point>
  );
}

export function GanttBracketOpen(props: PointProps) {
  return <BracketBase direction='open' {...props} />;
}

export function GanttBracketClose(props: PointProps) {
  return <BracketBase direction='close' {...props} />;
}
