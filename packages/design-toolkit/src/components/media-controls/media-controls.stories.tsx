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

import { MediaController } from 'media-chrome/react';
import { MediaProvider } from 'media-chrome/react/media-store';
import { MediaControls } from './index';
import { MuteButton } from './mute-button';
import { PlayButton } from './play-button';
import { PlaybackRateButton } from './playback-rate';
import { SeekButton } from './seek-button';
import { TimeDisplay } from './time-display';
import { TimeRange } from './time-range';
import { VolumeSlider } from './volume-slider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

const SAMPLE_AUDIO =
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

/**
 * Decorator that wraps stories in MediaProvider with an audio element.
 * Required for MediaControls to function properly.
 */
function MediaProviderDecorator({ children }: { children: ReactNode }) {
  return (
    <MediaProvider>
      <MediaController audio>
        {/* biome-ignore lint/a11y/useMediaCaption: Demo audio for Storybook */}
        <audio slot='media' src={SAMPLE_AUDIO} preload='metadata' />
        {children}
      </MediaController>
    </MediaProvider>
  );
}

const meta = {
  title: 'Components/MediaControls',
  component: PlayButton,
  decorators: [
    (Story) => (
      <MediaProviderDecorator>
        <Story />
      </MediaProviderDecorator>
    ),
  ],
  parameters: {
    controls: {
      exclude: [/^aria-/, 'className', 'ref', 'role'],
    },
  },
} satisfies Meta<typeof PlayButton>;

export default meta;
type Story = StoryObj<typeof PlayButton>;

// =============================================================================
// MediaControls (Composed) Stories
// =============================================================================

/**
 * MediaControls - Container for composing media control sub-components.
 * This example demonstrates all available controls in a polished two-row layout.
 */
export const MediaControlsComposed: StoryObj<typeof MediaControls> = {
  name: 'MediaControls',
  args: {
    isDisabled: false,
  },
  render: (args) => (
    <div className='w-[400px] rounded-medium bg-surface-raised p-m'>
      <MediaControls {...args} classNames={{ container: 'flex-col gap-s' }}>
        {/* Time row */}
        <div className='flex w-full items-center gap-s'>
          <TimeDisplay mode='current' />
          <TimeRange />
          <TimeDisplay mode='duration' />
        </div>

        {/* Controls row */}
        <div className='flex w-full items-center'>
          <div className='flex flex-1 items-center gap-s'>
            <MuteButton />
            <VolumeSlider />
          </div>
          <div className='flex items-center gap-xs'>
            <SeekButton direction='backward' />
            <PlayButton />
            <SeekButton direction='forward' />
          </div>
          <div className='flex flex-1 justify-end'>
            <PlaybackRateButton rates={[0.5, 1, 1.5, 2]} />
          </div>
        </div>
      </MediaControls>
    </div>
  ),
};

// =============================================================================
// PlayButton Stories
// =============================================================================

/**
 * PlayButton - Basic play/pause toggle button.
 * Shows Play icon when paused, Pause icon when playing.
 */
export const PlayButtonDefault: Story = {
  name: 'PlayButton',
  args: {
    isDisabled: false,
  },
  render: (args) => <PlayButton {...args} />,
};

// =============================================================================
// MuteButton Stories
// =============================================================================

/**
 * MuteButton - Basic mute/unmute toggle button.
 * Shows volume icon when unmuted, mute icon when muted.
 */
export const MuteButtonDefault: StoryObj<typeof MuteButton> = {
  name: 'MuteButton',
  args: {
    isDisabled: false,
  },
  render: (args) => <MuteButton {...args} />,
};

// =============================================================================
// SeekButton Stories
// =============================================================================

/**
 * SeekButton - Forward and backward seek buttons.
 * Seeks by default 10 seconds in the specified direction.
 */
export const SeekButtonDefault: StoryObj<typeof SeekButton> = {
  name: 'SeekButton',
  args: {
    direction: 'forward',
    seekOffset: 10,
    isDisabled: false,
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['forward', 'backward'],
    },
  },
  render: (args) => <SeekButton {...args} />,
};

// =============================================================================
// VolumeSlider Stories
// =============================================================================

/**
 * VolumeSlider - Basic volume slider control.
 */
export const VolumeSliderDefault: StoryObj<typeof VolumeSlider> = {
  name: 'VolumeSlider',
  args: {
    showLabel: false,
    isDisabled: false,
  },
  render: (args) => (
    <div className='w-[150px]'>
      <VolumeSlider {...args} />
    </div>
  ),
};

// =============================================================================
// TimeRange Stories
// =============================================================================

/**
 * TimeRange - Basic seek bar for navigating through media.
 */
export const TimeRangeDefault: StoryObj<typeof TimeRange> = {
  name: 'TimeRange',
  args: {
    isDisabled: false,
  },
  render: (args) => (
    <div className='w-[250px]'>
      <TimeRange {...args} />
    </div>
  ),
};

// =============================================================================
// TimeDisplay Stories
// =============================================================================

/**
 * TimeDisplay - Shows the current playback time.
 */
export const TimeDisplayDefault: StoryObj<typeof TimeDisplay> = {
  name: 'TimeDisplay',
  args: {
    mode: 'current',
    placeholder: 'hh:mm:ss',
    isDisabled: false,
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['current', 'remaining', 'duration'],
    },
  },
  render: (args) => <TimeDisplay {...args} />,
};

// =============================================================================
// PlaybackRateButton Stories
// =============================================================================

/**
 * PlaybackRateButton - Cycles through playback speeds (1x, 2x, 3x by default).
 */
export const PlaybackRateButtonDefault: StoryObj<typeof PlaybackRateButton> = {
  name: 'PlaybackRateButton',
  args: {
    rates: [1, 1.5, 2],
    isDisabled: false,
  },
  render: (args) => <PlaybackRateButton {...args} />,
};
