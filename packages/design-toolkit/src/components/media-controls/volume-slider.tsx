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
import { MediaVolumeRange } from 'media-chrome/react';
import { useMediaControlsDisabled } from './context';
import styles from './styles.module.css';
import type { VolumeSliderProps } from './types';

/**
 * A media control slider for adjusting volume.
 *
 * Wraps media-chrome's MediaVolumeRange component with DTK styling.
 * Integrates automatically with the media store for volume control.
 *
 * @param props - The slider props.
 * @param props.className - CSS class name for the slider container.
 * @param props.showLabel - Whether to show a "Volume" label.
 * @param props.isDisabled - Whether the slider is disabled.
 * @param props.ref - Ref to the container element.
 * @returns The rendered volume slider.
 *
 * @example
 * ```tsx
 * // Basic usage within MediaProvider
 * <MediaProvider>
 *   <VolumeSlider />
 * </MediaProvider>
 * ```
 *
 * @example
 * ```tsx
 * // With visible label
 * <VolumeSlider showLabel />
 * ```
 */
export function VolumeSlider({
  className,
  showLabel = false,
  isDisabled: isDisabledProp,
  ref,
}: VolumeSliderProps) {
  const isDisabled = useMediaControlsDisabled(isDisabledProp);

  return (
    <div
      ref={ref}
      className={clsx(styles.volumeSlider, className)}
      data-disabled={isDisabled || undefined}
    >
      {showLabel && <span className={styles.volumeLabel}>Volume</span>}
      <MediaVolumeRange
        className={styles.volumeRange}
        aria-label='Volume'
        // @ts-expect-error - disabled is a valid HTML attribute on the underlying web component
        disabled={isDisabled || undefined}
      />
    </div>
  );
}
