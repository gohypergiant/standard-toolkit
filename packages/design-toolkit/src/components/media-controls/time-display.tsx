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
import { MediaDurationDisplay, MediaTimeDisplay } from 'media-chrome/react';
import { useMediaSelector } from 'media-chrome/react/media-store';
import { useResolvedDisabled } from './context';
import styles from './styles.module.css';
import type { TimeDisplayProps } from './types';

/**
 * A media control component for displaying time information.
 *
 * Wraps media-chrome's time display components with DTK styling.
 * Can show current time, remaining time, or total duration.
 * Shows placeholder text until media metadata is loaded.
 *
 * @param props - The display props.
 * @param props.className - CSS class name for the container.
 * @param props.placeholder - Placeholder text before media loads (default: 'hh:mm:ss').
 * @param props.isDisabled - Whether the display is disabled.
 * @param props.mode - Display mode ('current', 'remaining', or 'duration').
 * @param props.ref - Ref to the container element.
 * @returns The rendered time display.
 *
 * @example
 * ```tsx
 * // Basic usage - shows current time
 * <MediaProvider>
 *   <TimeDisplay />
 * </MediaProvider>
 * ```
 *
 * @example
 * ```tsx
 * // Show total duration
 * <TimeDisplay mode="duration" />
 * ```
 *
 * @example
 * ```tsx
 * // Show remaining time
 * <TimeDisplay mode="remaining" />
 * ```
 *
 * @example
 * ```tsx
 * // Custom placeholder
 * <TimeDisplay placeholder="--:--" />
 * ```
 */
export function TimeDisplay({
  className,
  placeholder = 'hh:mm:ss',
  isDisabled: isDisabledProp,
  mode = 'current',
  ref,
}: TimeDisplayProps) {
  const mediaDuration = useMediaSelector((state) => state.mediaDuration);
  const isDisabled = useResolvedDisabled(isDisabledProp);
  const isLoaded = mediaDuration != null && mediaDuration > 0;

  const renderContent = () => {
    if (!isLoaded) {
      return <span className={styles.timeDisplayText}>{placeholder}</span>;
    }
    if (mode === 'duration') {
      return <MediaDurationDisplay className={styles.timeDisplayText} />;
    }
    // media-chrome: empty string enables remaining time, undefined shows current
    return (
      <MediaTimeDisplay
        className={styles.timeDisplayText}
        remaining={mode === 'remaining' || undefined}
      />
    );
  };

  return (
    <div
      ref={ref}
      className={clsx(styles.timeDisplay, className)}
      data-disabled={isDisabled || undefined}
    >
      {renderContent()}
    </div>
  );
}
