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
import { SoundAudible, SoundMute } from '@accelint/icons';
import {
  MediaActionTypes,
  useMediaDispatch,
  useMediaSelector,
  VolumeLevels,
} from 'media-chrome/react/media-store';
import { Button } from '../button';
import { Icon } from '../icon';
import { useResolvedDisabled } from './context';
import type { MuteButtonProps } from './types';

/**
 * A media control button for mute/unmute functionality.
 *
 * Integrates with media-chrome's media store to control media volume muting.
 * Automatically shows the appropriate icon based on the current mute state.
 *
 * @param props - The button props.
 * @param props.className - CSS class name for the button.
 * @param props.isDisabled - Whether the button is disabled.
 * @param props.ref - Ref to the button element.
 * @returns The rendered mute/unmute button.
 *
 * @example
 * ```tsx
 * // Basic usage within MediaProvider
 * <MediaProvider>
 *   <MuteButton />
 * </MediaProvider>
 * ```
 */
export function MuteButton({
  className,
  isDisabled: isDisabledProp,
  ref,
  ...rest
}: MuteButtonProps) {
  const dispatch = useMediaDispatch();
  const mediaMuted = useMediaSelector((state) => state.mediaMuted);
  const mediaVolumeLevel = useMediaSelector((state) => state.mediaVolumeLevel);
  const isDisabled = useResolvedDisabled(isDisabledProp);

  // Effective muted state: true when volume is off (either muted or volume=0)
  const isEffectivelyMuted = mediaVolumeLevel === VolumeLevels.OFF;

  const handleClick = () => {
    const type = mediaMuted
      ? MediaActionTypes.MEDIA_UNMUTE_REQUEST
      : MediaActionTypes.MEDIA_MUTE_REQUEST;
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
      aria-label={isEffectivelyMuted ? 'Unmute' : 'Mute'}
    >
      <Icon size='medium'>
        {isEffectivelyMuted ? <SoundMute /> : <SoundAudible />}
      </Icon>
    </Button>
  );
}
