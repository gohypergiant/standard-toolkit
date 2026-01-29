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
import { TIME_MARKER_WIDTH } from '../../constants';
import styles from './styles.module.css';

export function Tick(props: React.ComponentProps<'div'>) {
  const classNames = clsx('fg-disabled h-[6px] border', props.className);

  return (
    <div className='flex flex-1'>
      <span className={classNames} />
    </div>
  );
}

type TimeMarkerProps = {
  label: string;
};

export function TimeMarker({ label }: TimeMarkerProps) {
  return (
    <div className={styles.marker} data-width={TIME_MARKER_WIDTH}>
      <div className={styles.label} data-margin={TIME_MARKER_WIDTH / 4 - 2.5}>
        {label}
      </div>
      <div className='flex flex-row'>
        <Tick />
        <Tick />
      </div>
    </div>
  );
}
