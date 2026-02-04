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
import { formatError } from 'media-chrome/dist/labels/labels.js';
import { MediaController } from 'media-chrome/react';
import { MediaProvider, useMediaRef } from 'media-chrome/react/media-store';
import { useEffect, useState } from 'react';
import { MediaControlsProvider } from '../media-controls/context';
import { MuteButton } from '../media-controls/mute-button';
import { PlayButton } from '../media-controls/play-button';
import { PlaybackRateButton } from '../media-controls/playback-rate';
import { SeekButton } from '../media-controls/seek-button';
import { TimeDisplay } from '../media-controls/time-display';
import { TimeRange } from '../media-controls/time-range';
import { VolumeSlider } from '../media-controls/volume-slider';
import styles from './styles.module.css';
import type { AudioProps } from './types';

const logger = getLogger({
  enabled: true,
  level: 'error',
  prefix: '[Audio]',
  pretty: true,
});

/**
 * Internal component that renders within MediaProvider context.
 *
 * This component is separated from the main Audio component to allow use of
 * media-chrome hooks (useMediaRef) that require MediaProvider context.
 * The outer Audio component wraps everything in MediaProvider, then AudioInner
 * handles the actual audio element and controls rendering.
 *
 * @param props - The component props.
 * @param props.src - Audio source URL.
 * @param props.title - Title to display (e.g., filename).
 * @param props.classNames - Class names for sub-elements.
 * @param props.children - Custom controls (replaces default layout).
 * @param props.autoPlay - Whether to autoplay the audio.
 * @param props.loop - Whether to loop the audio.
 * @param props.muted - Whether the audio starts muted.
 * @param props.preload - Audio preload strategy.
 * @param props.crossOrigin - CORS setting for the audio element.
 * @param props.isDisabled - Whether to disable all audio controls.
 * @param props.onEnded - Callback when audio ends.
 * @param props.onTimeUpdate - Callback when playback time updates.
 * @param props.onLoadedMetadata - Callback when metadata is loaded.
 * @param props.onPlay - Callback when audio starts playing.
 * @param props.onPause - Callback when audio is paused.
 * @param props.onError - Callback when an error occurs.
 * @param props.playbackRates - Custom playback rate options.
 * @returns The audio element with controls.
 */
function AudioInner({
  src,
  title,
  children,
  classNames,
  autoPlay,
  loop,
  muted,
  preload = 'metadata',
  crossOrigin,
  isDisabled: isDisabledProp,
  onEnded,
  onTimeUpdate,
  onLoadedMetadata,
  onPlay,
  onPause,
  onError,
  playbackRates,
}: AudioProps) {
  const mediaRef = useMediaRef();
  const [errorMessage, setErrorMessage] = useState<string>('');

  // biome-ignore lint/correctness/useExhaustiveDependencies: src is intentionally used as a trigger to reset error state when audio source changes
  useEffect(() => {
    setErrorMessage('');
  }, [src]);

  const hasError = errorMessage !== '';
  const isDisabled = isDisabledProp === true || hasError;

  return (
    <>
      <audio
        ref={mediaRef}
        slot='media'
        className={styles.audio}
        data-testid='audio-element'
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        preload={preload}
        crossOrigin={crossOrigin}
        onEnded={() => onEnded?.()}
        onTimeUpdate={(e) => {
          const time = e.currentTarget.currentTime;
          if (Number.isFinite(time)) {
            onTimeUpdate?.(time);
          }
        }}
        onLoadedMetadata={(e) => onLoadedMetadata?.(e)}
        onPlay={(e) => onPlay?.(e)}
        onPause={(e) => onPause?.(e)}
        onError={(e) => {
          const mediaError = e.currentTarget.error;
          logger
            .withContext({ src })
            .withError(mediaError)
            .error('Failed to load audio');
          setErrorMessage(
            (mediaError && formatError(mediaError)?.message) ??
              'Unable to load audio file',
          );
          if (mediaError) {
            onError?.(mediaError);
          }
        }}
      >
        <source src={src} />
      </audio>

      <MediaControlsProvider isDisabled={isDisabled}>
        {children ?? (
          <>
            {title && (
              <div className={clsx(styles.titleRow, classNames?.title)}>
                {title}
              </div>
            )}

            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}

            <div className={clsx(styles.controls, classNames?.mediaControls)}>
              <div className={clsx(styles.timeRow, classNames?.timeRow)}>
                <TimeDisplay mode='current' />
                <TimeRange />
                <TimeDisplay mode='duration' />
              </div>

              <div
                className={clsx(styles.controlsRow, classNames?.controlsRow)}
              >
                <div className={styles.leftGroup}>
                  <div className={styles.volumeGroup}>
                    <MuteButton />
                    <VolumeSlider />
                  </div>
                </div>
                <div className={styles.playbackGroup}>
                  <SeekButton direction='backward' />
                  <PlayButton />
                  <SeekButton direction='forward' />
                </div>
                <div className={styles.rightGroup}>
                  <PlaybackRateButton rates={playbackRates} />
                </div>
              </div>
            </div>
          </>
        )}
      </MediaControlsProvider>
    </>
  );
}

/**
 * A complete audio player component.
 *
 * Combines an HTML audio element with MediaControls to provide a fully-featured
 * audio player with play/pause, seek, volume control, and playback rate adjustment.
 *
 * Uses media-chrome under the hood for state management and MediaController
 * for the accessible media chrome elements.
 *
 * @param props - The component props.
 * @param props.src - Audio source URL. Must be accessible to the browser - if loading
 *   from a different origin, ensure the server sends appropriate CORS headers
 *   (Access-Control-Allow-Origin) or use the crossOrigin prop.
 * @param props.title - Title to display (e.g., filename).
 * @param props.classNames - Class names for sub-elements.
 * @param props.isDisabled - Disable all audio controls.
 * @param props.crossOrigin - CORS setting ('anonymous' | 'use-credentials'). Required when
 *   loading audio from a different origin that requires credentials or when using canvas
 *   to analyze audio. Without proper CORS configuration, the audio may fail to load.
 * @param props.playbackRates - Array of playback speed multipliers (default: [1, 2, 3]).
 *   Only positive finite numbers are accepted; invalid values are filtered out.
 * @param props.children - Custom controls to render instead of the default layout.
 * @param props.onEnded - Callback invoked when audio playback finishes.
 * @param props.onTimeUpdate - Callback invoked during playback with current time in seconds.
 * @param props.onError - Callback invoked when audio fails to load or encounters an error.
 * @param props.noHotkeys - Disable all keyboard shortcuts for media control.
 * @param props.hotkeys - Custom keyboard shortcuts configuration for media control.
 * @param props.noVolumePref - Disable automatic saving/restoring of volume preference.
 * @param props.noMutedPref - Disable automatic saving/restoring of muted state preference.
 * @param props.lang - Language code for localized media control labels.
 * @returns The rendered audio player component.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Audio src="audio.mp3" title="My Audio File" />
 * ```
 *
 * @example
 * ```tsx
 * // With event callbacks
 * <Audio
 *   src="audio.mp3"
 *   title="My Audio File"
 *   onPlay={() => console.log('Playing')}
 *   onPause={() => console.log('Paused')}
 *   onEnded={() => console.log('Ended')}
 *   onTimeUpdate={(time) => console.log('Current time:', time)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Custom controls layout
 * <Audio src="audio.mp3">
 *   <PlayButton />
 *   <TimeRange />
 * </Audio>
 * ```
 *
 * @example
 * ```tsx
 * // Loading audio from external origin (requires CORS)
 * <Audio
 *   src="https://example.com/audio.mp3"
 *   crossOrigin="anonymous"
 *   onError={(error) => {
 *     // Handle CORS or loading errors
 *     console.error('Failed to load audio:', error);
 *   }}
 * />
 * ```
 */
export function Audio({
  classNames,
  isDisabled,
  noHotkeys,
  hotkeys,
  noVolumePref,
  noMutedPref,
  lang,
  ...rest
}: AudioProps) {
  return (
    <MediaProvider>
      <MediaController
        className={clsx('group/audio', styles.container, classNames?.container)}
        audio
        data-disabled={isDisabled || undefined}
        noHotkeys={noHotkeys}
        hotkeys={hotkeys}
        noVolumePref={noVolumePref}
        noMutedPref={noMutedPref}
        lang={lang}
      >
        <AudioInner {...rest} classNames={classNames} isDisabled={isDisabled} />
      </MediaController>
    </MediaProvider>
  );
}
