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
import { CollapseWindow, FullScreen } from '@accelint/icons';
import {
  MediaActionTypes,
  useMediaDispatch,
  useMediaSelector,
} from 'media-chrome/react/media-store';
import { useCallback } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { useMediaControlsDisabled } from './context';
import type { FullscreenButtonProps } from './types';
import type { MediaState } from 'media-chrome/react/media-store';

const selectIsFullscreen = (state: MediaState) => state.mediaIsFullscreen;

/**
 * A media control button for entering/exiting fullscreen.
 *
 * Integrates with media-chrome's media store to control fullscreen state.
 * Automatically shows the appropriate icon based on the current fullscreen state.
 *
 * @param props - The button props.
 * @param props.className - CSS class name for the button.
 * @param props.isDisabled - Whether the button is disabled.
 * @param props.ref - Ref to the button element.
 * @returns The rendered fullscreen button.
 *
 * @example
 * ```tsx
 * // Usage within Video component (recommended)
 * <Video src="video.mp4">
 *   <FullscreenButton />
 * </Video>
 *
 * // Or with explicit provider hierarchy
 * <MediaProvider>
 *   <MediaController>
 *     <video slot="media" />
 *     <FullscreenButton />
 *   </MediaController>
 * </MediaProvider>
 * ```
 */
export function FullscreenButton({
  className,
  isDisabled: isDisabledProp,
  ref,
  ...rest
}: FullscreenButtonProps) {
  const dispatch = useMediaDispatch();
  const mediaIsFullscreen = useMediaSelector(selectIsFullscreen);
  const isDisabled = useMediaControlsDisabled(isDisabledProp);

  const handleClick = useCallback(() => {
    const type = mediaIsFullscreen
      ? MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST
      : MediaActionTypes.MEDIA_ENTER_FULLSCREEN_REQUEST;
    dispatch({ type });
  }, [dispatch, mediaIsFullscreen]);

  return (
    <Button
      {...rest}
      ref={ref}
      className={className}
      variant='icon'
      size='medium'
      isDisabled={isDisabled}
      onPress={handleClick}
      aria-label={mediaIsFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      <Icon size='medium'>
        {mediaIsFullscreen ? <CollapseWindow /> : <FullScreen />}
      </Icon>
    </Button>
  );
}
