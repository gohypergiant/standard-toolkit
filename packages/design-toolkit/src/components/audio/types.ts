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

import type { ComponentPropsWithRef, ReactNode } from 'react';

export type AudioProps = Omit<
  ComponentPropsWithRef<'audio'>,
  'children' | 'onEnded' | 'onTimeUpdate' | 'onError'
> & {
  /** Title to display (e.g., filename) */
  title?: string;
  /** Disable all audio controls */
  isDisabled?: boolean;
  /** Custom controls (replaces default layout) */
  children?: ReactNode;
  /** Class names for sub-elements */
  classNames?: {
    container?: string;
    title?: string;
    mediaControls?: string;
    timeRow?: string;
    controlsRow?: string;
  };
  /** Callback when audio ends */
  onEnded?: () => void;
  /** Callback when playback time updates */
  onTimeUpdate?: (currentTime: number) => void;
  /** Callback when audio fails to load or encounters an error */
  onError?: (error: MediaError | null) => void;
  /** Custom playback rate options (default: [1, 2, 3]) */
  playbackRates?: number[];
};
