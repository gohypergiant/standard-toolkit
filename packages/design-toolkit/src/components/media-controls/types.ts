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

import type { ComponentPropsWithRef } from 'react';
import type { AriaAttributesWithRef } from '@/lib/types';
import type { ButtonProps } from '../button/types';

/**
 * Locked-down button props for media controls.
 *
 * Style variants are controlled internally to ensure consistent appearance.
 */
type MediaButtonProps = Omit<ButtonProps, 'variant' | 'size' | 'color'>;

/**
 * Props for the MediaControls component.
 */
export type MediaControlsProps = ComponentPropsWithRef<'div'> & {
  classNames?: {
    container?: string;
  };
  /**
   * Disables all child controls via context. Individual control isDisabled props take precedence.
   */
  isDisabled?: boolean;
};

/**
 * Props for the PlayButton component.
 */
export type PlayButtonProps = MediaButtonProps;

/**
 * Props for the MuteButton component.
 */
export type MuteButtonProps = MediaButtonProps;

/**
 * Props for the FullscreenButton component.
 */
export type FullscreenButtonProps = MediaButtonProps;

/**
 * Props for the SeekButton component.
 */
export type SeekButtonProps = MediaButtonProps & {
  /** Direction to seek: 'forward' advances playback, 'backward' rewinds. */
  direction: 'forward' | 'backward';
  /**
   * Number of seconds to seek. Must be a positive finite number.
   * Invalid values (NaN, Infinity, negative, zero) fall back to default (10).
   * @default 10
   */
  seekOffset?: number;
};

/**
 * Props for the PlaybackRateButton component.
 */
export type PlaybackRateButtonProps = MediaButtonProps & {
  /**
   * Array of playback rates to cycle through.
   * @default [1, 2, 3]
   */
  rates?: number[];
};

/**
 * Base props for div-based media controls.
 */
type MediaControlBaseProps = {
  /** CSS class name for the control container. */
  className?: string;
  /**
   * Disables this specific control. When true, the control is non-interactive.
   * Component-level isDisabled takes precedence over context-level disabled state.
   */
  isDisabled?: boolean;
};

/**
 * Props for the VolumeSlider component.
 */
export type VolumeSliderProps = MediaControlBaseProps &
  AriaAttributesWithRef<HTMLDivElement> & {
    /** Whether to show a "Volume" label above the slider. */
    showLabel?: boolean;
  };

/**
 * Props for the TimeRange component.
 */
export type TimeRangeProps = MediaControlBaseProps &
  AriaAttributesWithRef<HTMLDivElement>;

/**
 * Time display mode - mutually exclusive options.
 *
 * - 'current': Shows current playback time
 * - 'remaining': Shows remaining time
 * - 'duration': Shows total duration
 */
export type TimeDisplayMode = 'current' | 'remaining' | 'duration';

/**
 * Props for the TimeDisplay component.
 */
export type TimeDisplayProps = MediaControlBaseProps &
  AriaAttributesWithRef<HTMLDivElement> & {
    /**
     * Display mode for the time.
     * - 'current': Shows current playback time (default)
     * - 'remaining': Shows remaining time
     * - 'duration': Shows total duration
     */
    mode?: TimeDisplayMode;
    /** Text shown when time value is unavailable or loading (e.g., "--:--"). */
    placeholder?: string;
  };

/**
 * Context value for MediaControls.
 *
 * Provides shared state to all media control children.
 */
export type MediaControlsContextValue = {
  /** Whether controls are disabled. */
  isDisabled: boolean;
};
