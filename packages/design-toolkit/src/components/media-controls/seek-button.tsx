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
import { useCallback } from 'react';
import { FastForward, FastRewind } from '@accelint/icons';
import { getLogger } from '@accelint/logger/default';
import {
  MediaActionTypes,
  useMediaDispatch,
  useMediaSelector,
} from 'media-chrome/react/media-store';
import { Button } from '../button';
import { Icon } from '../icon';
import { useMediaControlsDisabled } from './context';
import type { SeekButtonProps } from './types';

const logger = getLogger({
  enabled: process.env.NODE_ENV === 'development',
  level: 'warn',
  prefix: '[SeekButton]',
  pretty: true,
});

/** Default seek distance in seconds. */
const DEFAULT_SEEK_OFFSET = 10;

/**
 * Validates that value is a positive finite number.
 *
 * @param value - The number to validate.
 * @returns True if the value is positive and finite.
 */
function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

/**
 * A media control button for seeking forward or backward.
 *
 * Integrates with media-chrome's media store to seek the media playback position.
 * Can be configured to seek forward or backward with a customizable time offset.
 * Invalid seekOffset values (negative, zero, NaN, Infinity) automatically fall back
 * to the default of 10 seconds.
 *
 * @param props - The button props.
 * @param props.className - CSS class name for the button.
 * @param props.direction - Direction to seek ('forward' or 'backward').
 * @param props.seekOffset - Number of seconds to seek (default: 10). Must be a positive finite number.
 * @param props.isDisabled - Whether the button is disabled.
 * @param props.ref - Ref to the button element.
 * @returns The rendered seek button.
 *
 * @example
 * ```tsx
 * // Basic usage within MediaProvider
 * <MediaProvider>
 *   <SeekButton direction="backward" />
 *   <SeekButton direction="forward" />
 * </MediaProvider>
 * ```
 *
 * @example
 * ```tsx
 * // With custom seek offset (30 seconds)
 * <SeekButton direction="forward" seekOffset={30} />
 * ```
 */
export function SeekButton({
  className,
  direction,
  seekOffset: seekOffsetProp = DEFAULT_SEEK_OFFSET,
  isDisabled: isDisabledProp,
  ref,
  ...rest
}: SeekButtonProps) {
  const dispatch = useMediaDispatch();
  const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
  const mediaDuration = useMediaSelector((state) => state.mediaDuration);
  const isDisabledFromContext = useMediaControlsDisabled(isDisabledProp);

  // Validate and resolve seekOffset
  const seekOffset = isPositiveFinite(seekOffsetProp)
    ? seekOffsetProp
    : DEFAULT_SEEK_OFFSET;

  if (seekOffset !== seekOffsetProp) {
    logger.warn(
      `Invalid seekOffset "${seekOffsetProp}", using default (${DEFAULT_SEEK_OFFSET}).`,
    );
  }

  // Disable when media not loaded (duration unavailable)
  const isMediaLoaded =
    mediaDuration != null && mediaDuration > 0 && mediaCurrentTime != null;
  const isDisabled = isDisabledFromContext || !isMediaLoaded;

  const handleClick = useCallback(() => {
    if (mediaCurrentTime == null || mediaDuration == null) {
      return;
    }

    const delta = direction === 'forward' ? seekOffset : -seekOffset;
    const targetTime = Math.max(
      0,
      Math.min(mediaDuration, mediaCurrentTime + delta),
    );
    dispatch({ type: MediaActionTypes.MEDIA_SEEK_REQUEST, detail: targetTime });
  }, [mediaCurrentTime, mediaDuration, direction, seekOffset, dispatch]);

  return (
    <Button
      {...rest}
      ref={ref}
      className={className}
      variant='icon'
      size='medium'
      isDisabled={isDisabled}
      onPress={handleClick}
      aria-label={`Seek ${direction} ${seekOffset} seconds`}
    >
      <Icon size='medium'>
        {direction === 'forward' ? <FastForward /> : <FastRewind />}
      </Icon>
    </Button>
  );
}
