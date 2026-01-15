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
import { Pause, Play } from '@accelint/icons';
import {
  MediaActionTypes,
  useMediaDispatch,
  useMediaSelector,
} from 'media-chrome/react/media-store';
import { Button } from '../button';
import { Icon } from '../icon';
import { useResolvedDisabled } from './context';
import type { PlayButtonProps } from './types';

/**
 * A media control button for play/pause functionality.
 *
 * Integrates with media-chrome's media store to control media playback.
 * Automatically shows the appropriate icon based on the current playback state.
 *
 * @param props - The button props.
 * @param props.className - CSS class name for the button.
 * @param props.isDisabled - Whether the button is disabled.
 * @param props.ref - Ref to the button element.
 * @returns The rendered play/pause button.
 *
 * @example
 * ```tsx
 * // Basic usage within MediaProvider
 * <MediaProvider>
 *   <PlayButton />
 * </MediaProvider>
 * ```
 */
export function PlayButton({
  className,
  isDisabled: isDisabledProp,
  ref,
  ...rest
}: PlayButtonProps) {
  const dispatch = useMediaDispatch();
  const mediaPaused = useMediaSelector((state) => state.mediaPaused);
  const isDisabled = useResolvedDisabled(isDisabledProp);

  const handleClick = () => {
    const type = mediaPaused
      ? MediaActionTypes.MEDIA_PLAY_REQUEST
      : MediaActionTypes.MEDIA_PAUSE_REQUEST;
    dispatch({ type });
  };

  return (
    <Button
      {...rest}
      ref={ref}
      className={className}
      variant='icon'
      size='medium'
      isDisabled={isDisabled}
      onPress={handleClick}
      aria-label={mediaPaused ? 'Play' : 'Pause'}
    >
      <Icon size='medium'>{mediaPaused ? <Play /> : <Pause />}</Icon>
    </Button>
  );
}
