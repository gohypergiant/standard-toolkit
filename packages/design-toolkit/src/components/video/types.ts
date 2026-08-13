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

import type { ComponentProps, ComponentPropsWithRef, ReactNode } from 'react';
import type { MediaController } from 'media-chrome/react';

export type VideoProps = Omit<
  ComponentPropsWithRef<'video'>,
  'children' | 'onEnded' | 'onTimeUpdate' | 'onError' | 'src' | 'className'
> &
  Pick<
    ComponentProps<typeof MediaController>,
    'noHotkeys' | 'hotkeys' | 'noVolumePref' | 'noMutedPref' | 'lang'
  > & {
    /** Video source URL */
    src: string;
    /** Poster image URL displayed before playback */
    poster?: string;
    /** Disable all video controls */
    isDisabled?: boolean;
    /** Custom controls (replaces default layout) */
    children?: ReactNode;
    /**
     * Class names for sub-elements.
     * @property container - The outer MediaController wrapper element.
     * @property video - The native HTML video element.
     * @property mediaControls - The controls overlay container.
     * @property timeRow - The row containing time display and seek bar.
     * @property controlsRow - The row containing playback and volume controls.
     */
    classNames?: {
      container?: string;
      video?: string;
      mediaControls?: string;
      timeRow?: string;
      controlsRow?: string;
    };
    /** Callback when video ends */
    onEnded?: () => void;
    /** Callback when playback time updates */
    onTimeUpdate?: (currentTime: number) => void;
    /** Callback when video fails to load or encounters an error */
    onError?: (error: MediaError) => void;
    /** Custom playback rate options (default: [1, 2, 3]) */
    playbackRates?: number[];
  };
