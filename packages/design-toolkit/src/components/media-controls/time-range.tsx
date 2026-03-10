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
'use client';

import 'client-only';
import { clsx } from '@accelint/design-foundation/lib/utils';
import { MediaTimeDisplay, MediaTimeRange } from 'media-chrome/react';
import { useMediaControlsDisabled } from './context';
import styles from './styles.module.css';
import type { TimeRangeProps } from './types';

/**
 * A media control slider for seeking through media.
 *
 * Wraps media-chrome's MediaTimeRange component with DTK styling.
 * Shows the current playback position and allows seeking.
 *
 * @param props - The slider props.
 * @param props.className - CSS class name for the container.
 * @param props.isDisabled - Whether the slider is disabled.
 * @param props.ref - Ref to the container element.
 * @returns The rendered time range slider.
 *
 * @example
 * ```tsx
 * // Basic usage within MediaProvider
 * <MediaProvider>
 *   <TimeRange />
 * </MediaProvider>
 * ```
 */
export function TimeRange({
  className,
  isDisabled: isDisabledProp,
  ref,
}: TimeRangeProps) {
  const isDisabled = useMediaControlsDisabled(isDisabledProp);

  return (
    <div ref={ref} className={clsx(styles.timeRange, className)}>
      <MediaTimeRange
        className={styles.timeRangeInput}
        aria-label='Seek'
        // @ts-expect-error - disabled prop is supported by the underlying web component but not in media-chrome's TypeScript types

        disabled={isDisabled || undefined}
      >
        <MediaTimeDisplay
          slot='current'
          className={styles.currentTimeDisplay}
        />
      </MediaTimeRange>
    </div>
  );
}
