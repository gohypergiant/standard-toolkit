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
import { getLogger } from '@accelint/logger/default';
import {
  MediaActionTypes,
  useMediaDispatch,
  useMediaSelector,
} from 'media-chrome/react/media-store';
import { useCallback } from 'react';
import { Button } from '../button';
import { useMediaControlsDisabled } from './context';
import styles from './styles.module.css';
import type { PlaybackRateButtonProps } from './types';

const logger = getLogger({
  enabled: process.env.NODE_ENV === 'development',
  level: 'warn',
  prefix: '[PlaybackRateButton]',
  pretty: true,
});

const DEFAULT_RATES = [1, 2, 3];

/**
 * Filters to only positive finite numbers.
 *
 * @param rates - Array of rate values to filter.
 * @returns Array containing only positive finite rates.
 */
const filterValidRates = (rates: number[]) =>
  rates.filter((r) => Number.isFinite(r) && r > 0);

/**
 * A media control button for changing playback speed.
 *
 * Integrates with media-chrome's media store to control playback rate.
 * Cycles through available playback rates on each click.
 * Shows the current playback rate as text (e.g., '1x', '2x').
 *
 * @param props - The button props.
 * @param props.className - CSS class name for the button.
 * @param props.rates - Array of playback rates to cycle through (default: [1, 2, 3]).
 * @param props.isDisabled - Whether the button is disabled.
 * @param props.ref - Ref to the button element.
 * @returns The rendered playback rate button.
 *
 * @example
 * ```tsx
 * // Basic usage within MediaProvider
 * <MediaProvider>
 *   <PlaybackRateButton />
 * </MediaProvider>
 * ```
 *
 * @example
 * ```tsx
 * // With custom rates
 * <PlaybackRateButton rates={[0.5, 1, 1.5, 2]} />
 * ```
 */
export function PlaybackRateButton({
  className,
  rates = DEFAULT_RATES,
  isDisabled: isDisabledProp,
  ref,
  ...rest
}: PlaybackRateButtonProps) {
  const dispatch = useMediaDispatch();
  const mediaPlaybackRate = useMediaSelector(
    (state) => state.mediaPlaybackRate ?? 1,
  );
  const isDisabled = useMediaControlsDisabled(isDisabledProp);

  const validRates = filterValidRates(rates);
  const safeRates = validRates.length > 0 ? validRates : DEFAULT_RATES;

  if (validRates.length === 0 && rates.length > 0) {
    logger.warn(
      `Invalid rates provided, using defaults [${DEFAULT_RATES.join(', ')}].`,
    );
  }

  const displayRate =
    Number.isFinite(mediaPlaybackRate) && mediaPlaybackRate > 0
      ? mediaPlaybackRate
      : safeRates[0];

  const handleClick = useCallback(() => {
    const currentIndex = safeRates.indexOf(mediaPlaybackRate);
    const nextIndex = (currentIndex + 1) % safeRates.length;
    dispatch({
      type: MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST,
      detail: safeRates[nextIndex],
    });
  }, [dispatch, mediaPlaybackRate, safeRates]);

  return (
    <Button
      {...rest}
      ref={ref}
      className={clsx(styles.playbackRate, className)}
      variant='icon'
      size='medium'
      isDisabled={isDisabled}
      onPress={handleClick}
      aria-label={`Playback rate ${displayRate}x`}
      data-testid='playback-rate'
    >
      <span className={styles.playbackRateText}>{displayRate}x</span>
    </Button>
  );
}
