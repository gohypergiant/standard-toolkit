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
import { Loop, Problem } from '@accelint/icons';
import { getLogger } from '@accelint/logger/default';
import { formatError } from 'media-chrome/dist/labels/labels.js';
import { MediaController } from 'media-chrome/react';
import {
  MediaProvider,
  useMediaRef,
  useMediaSelector,
} from 'media-chrome/react/media-store';
import type { MediaState } from 'media-chrome/react/media-store';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '../icon';
import { FullscreenButton } from '../media-controls/fullscreen-button';
import { MediaControlsProvider } from '../media-controls/context';
import { MuteButton } from '../media-controls/mute-button';
import { PlayButton } from '../media-controls/play-button';
import { PlaybackRateButton } from '../media-controls/playback-rate';
import { SeekButton } from '../media-controls/seek-button';
import { TimeDisplay } from '../media-controls/time-display';
import { TimeRange } from '../media-controls/time-range';
import { VolumeSlider } from '../media-controls/volume-slider';
import styles from './styles.module.css';
import type { VideoProps } from './types';

const logger = getLogger({
  enabled: true,
  level: 'error',
  prefix: '[Video]',
  pretty: true,
});

const selectMediaLoading = (state: MediaState) => state.mediaLoading;
const selectMediaDuration = (state: MediaState) => state.mediaDuration;

/**
 * Internal component that renders within MediaProvider context.
 *
 * This component is separated from the main Video component to allow use of
 * media-chrome hooks (useMediaRef) that require MediaProvider context.
 * The outer Video component wraps everything in MediaProvider, then VideoInner
 * handles the actual video element and controls rendering.
 *
 * @param props - The component props.
 * @param props.src - Video source URL.
 * @param props.poster - Poster image URL displayed before playback.
 * @param props.classNames - Class names for sub-elements.
 * @param props.children - Custom controls (replaces default layout).
 * @param props.autoPlay - Whether to autoplay the video.
 * @param props.loop - Whether to loop the video.
 * @param props.muted - Whether the video starts muted.
 * @param props.preload - Video preload strategy.
 * @param props.crossOrigin - CORS setting for the video element.
 * @param props.isDisabled - Whether to disable all video controls.
 * @param props.onEnded - Callback when video ends.
 * @param props.onTimeUpdate - Callback when playback time updates.
 * @param props.onError - Callback when an error occurs.
 * @param props.playbackRates - Custom playback rate options.
 * @returns The video element with controls.
 */
function VideoInner({
  src,
  poster,
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
  onError,
  playbackRates,
}: VideoProps) {
  const mediaRef = useMediaRef();
  const [errorMessage, setErrorMessage] = useState<string>('');

  // biome-ignore lint/correctness/useExhaustiveDependencies: src is intentionally used as a trigger to reset error state when video source changes
  useEffect(() => {
    setErrorMessage('');
  }, [src]);

  const mediaLoading = useMediaSelector(selectMediaLoading);
  const mediaDuration = useMediaSelector(selectMediaDuration);
  const isMetadataLoaded =
    mediaDuration !== null && mediaDuration !== undefined && mediaDuration > 0;
  const hasError = errorMessage !== '';
  const showLoading = !hasError && (mediaLoading || !isMetadataLoaded);
  const isDisabled = isDisabledProp === true || hasError;

  const handleEnded = useCallback(() => {
    onEnded?.();
  }, [onEnded]);

  const handleTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const time = e.currentTarget.currentTime;
      if (Number.isFinite(time)) {
        onTimeUpdate?.(time);
      }
    },
    [onTimeUpdate],
  );

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const mediaError = e.currentTarget.error;
      logger
        .withContext({ src })
        .withError(mediaError)
        .error('Failed to load video');
      setErrorMessage(
        (mediaError && formatError(mediaError)?.message) ??
          'Unable to load video file',
      );
      if (mediaError) {
        onError?.(mediaError);
      }
    },
    [src, onError],
  );

  return (
    <>
      <video
        ref={mediaRef}
        slot='media'
        className={clsx(styles.video, classNames?.video)}
        data-testid='video-element'
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        preload={preload}
        crossOrigin={crossOrigin}
        poster={poster}
        playsInline
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onError={handleError}
      >
        <source src={src} />
      </video>

      {showLoading && (
        <output className={styles.loadingOverlay} aria-label='Loading video'>
          <Icon size='medium' className={styles.loadingSpinner}>
            <Loop />
          </Icon>
        </output>
      )}

      {errorMessage && (
        <div className={styles.errorOverlay} role='alert'>
          <Icon size='medium'>
            <Problem />
          </Icon>
          <span className={styles.errorText}>{errorMessage}</span>
        </div>
      )}

      <MediaControlsProvider isDisabled={isDisabled}>
        {/* noautohide tells MediaController (web component) to keep this element visible */}
        {children ?? (
          <div className={styles.controlsOverlay} noautohide=''>
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
                  <FullscreenButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </MediaControlsProvider>
    </>
  );
}

/**
 * A complete video player component.
 *
 * Combines an HTML video element with MediaControls to provide a fully-featured
 * video player with play/pause, seek, volume control, playback rate adjustment,
 * and fullscreen support.
 *
 * Uses media-chrome under the hood for state management and MediaController
 * for the accessible media chrome elements.
 *
 * @param props - The component props.
 * @param props.src - Video source URL. Must be accessible to the browser - if loading
 *   from a different origin, ensure the server sends appropriate CORS headers
 *   (Access-Control-Allow-Origin) or use the crossOrigin prop.
 * @param props.poster - Poster image URL displayed before playback starts.
 * @param props.classNames - Class names for sub-elements.
 * @param props.isDisabled - Disable all video controls.
 * @param props.crossOrigin - CORS setting ('anonymous' | 'use-credentials'). Required when
 *   loading video from a different origin that requires credentials.
 * @param props.playbackRates - Array of playback speed multipliers (default: [1, 2, 3]).
 *   Only positive finite numbers are accepted; invalid values are filtered out.
 * @param props.children - Custom controls to render instead of the default layout.
 * @param props.onEnded - Callback invoked when video playback finishes.
 * @param props.onTimeUpdate - Callback invoked during playback with current time in seconds.
 * @param props.onError - Callback invoked when video fails to load or encounters an error.
 * @param props.noHotkeys - Disable all keyboard shortcuts for media control.
 * @param props.hotkeys - Custom keyboard shortcuts configuration for media control.
 * @param props.noVolumePref - Disable automatic saving/restoring of volume preference.
 * @param props.noMutedPref - Disable automatic saving/restoring of muted state preference.
 * @param props.lang - Language code for localized media control labels.
 * @returns The rendered video player component.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Video src="video.mp4" />
 * ```
 *
 * @example
 * ```tsx
 * // With poster image
 * <Video
 *   src="video.mp4"
 *   poster="thumbnail.jpg"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With event callbacks
 * <Video
 *   src="video.mp4"
 *   onEnded={() => console.log('Ended')}
 *   onTimeUpdate={(time) => console.log('Current time:', time)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Custom controls layout
 * <Video src="video.mp4">
 *   <PlayButton />
 *   <TimeRange />
 * </Video>
 * ```
 */
export function Video({
  classNames,
  isDisabled,
  noHotkeys,
  hotkeys,
  noVolumePref,
  noMutedPref,
  lang,
  ...rest
}: VideoProps) {
  return (
    <MediaProvider>
      <MediaController
        className={clsx('group/video', styles.container, classNames?.container)}
        data-disabled={isDisabled || undefined}
        noHotkeys={noHotkeys}
        hotkeys={hotkeys}
        noVolumePref={noVolumePref}
        noMutedPref={noMutedPref}
        lang={lang}
      >
        <VideoInner {...rest} classNames={classNames} isDisabled={isDisabled} />
      </MediaController>
    </MediaProvider>
  );
}
