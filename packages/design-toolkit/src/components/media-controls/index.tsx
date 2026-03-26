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
import { MediaControlsProvider, useMediaProviderGuard } from './context';
import styles from './styles.module.css';
import type { MediaControlsProps } from './types';

/**
 * A container for media playback controls.
 *
 * Composes media control sub-components into a cohesive control bar.
 * Must be used within a MediaProvider context from media-chrome.
 *
 * @param props - The component props.
 * @param props.className - CSS class name for the container.
 * @param props.classNames - Class names for sub-elements.
 * @param props.children - Media control components to render.
 * @param props.isDisabled - Disables all child controls via context.
 * @returns The rendered media controls container.
 *
 * @example
 * ```tsx
 * <MediaProvider>
 *   <MediaControls>
 *     <PlayButton />
 *     <TimeDisplay mode="current" />
 *     <TimeRange />
 *     <MuteButton />
 *     <VolumeSlider />
 *   </MediaControls>
 * </MediaProvider>
 * ```
 *
 * @example
 * ```tsx
 * // Audio player with seek controls
 * <MediaProvider>
 *   <MediaControls>
 *     <SeekButton direction="backward" seekOffset={15} />
 *     <PlayButton />
 *     <SeekButton direction="forward" seekOffset={15} />
 *     <TimeDisplay mode="current" />
 *     <PlaybackRateButton rates={[0.5, 1, 1.5, 2]} />
 *   </MediaControls>
 * </MediaProvider>
 * ```
 */
export function MediaControls({
  className,
  classNames,
  children,
  isDisabled = false,
  ...rest
}: MediaControlsProps) {
  useMediaProviderGuard();

  return (
    <MediaControlsProvider isDisabled={isDisabled}>
      <div
        {...rest}
        className={clsx(
          'group/media-controls',
          styles.mediaControls,
          className,
          classNames?.container,
        )}
        data-disabled={isDisabled || undefined}
      >
        {children}
      </div>
    </MediaControlsProvider>
  );
}
