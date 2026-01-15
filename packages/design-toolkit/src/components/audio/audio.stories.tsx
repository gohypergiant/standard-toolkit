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

import { Audio } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';

const SAMPLE_AUDIO = '/test.mp3';

const meta = {
  title: 'Components/Audio',
  component: Audio,
  args: {
    src: SAMPLE_AUDIO,
    isDisabled: false,
    muted: false,
    autoPlay: false,
    loop: false,
    playbackRates: [1, 2, 3],
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'Audio source URL or array of sources',
    },
    title: {
      control: 'text',
      description: 'Title to display above the controls',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disable all audio controls',
    },
    autoPlay: {
      control: 'boolean',
      description: 'Autoplay (note: browsers may block this)',
    },
    loop: {
      control: 'boolean',
      description: 'Loop the audio when it ends',
    },
    muted: {
      control: 'boolean',
      description: 'Start the audio muted',
    },
    preload: {
      control: 'select',
      options: ['none', 'metadata', 'auto'],
      description: 'Preload behavior for the audio element',
    },
    playbackRates: {
      control: 'object',
      description: 'Array of playback rate options (e.g., [0.5, 1, 1.5, 2])',
    },
  },
} satisfies Meta<typeof Audio>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderInWrapper: Story['render'] = (args) => (
  <div className='w-[400px]'>
    <Audio {...args} />
  </div>
);

/**
 * Default audio player with standard controls.
 * Includes play/pause, seek, volume, and playback rate controls.
 */
export const Default: Story = {
  render: renderInWrapper,
};

/**
 * Audio player with a title displayed above the controls.
 * Useful for showing the filename or track name.
 */
export const WithTitle: Story = {
  args: {
    title: 'Sample Audio Track.mp3',
  },
  render: renderInWrapper,
};

/**
 * Audio player with event callbacks.
 * Open the browser console to see the events being logged.
 */
export const Events: Story = {
  args: {
    title: 'Audio with Event Callbacks',
    onPlay: () => console.log('[Audio] Play event'),
    onPause: () => console.log('[Audio] Pause event'),
    onEnded: () => console.log('[Audio] Ended event'),
    onTimeUpdate: (time) =>
      console.log('[Audio] Time update:', time.toFixed(2)),
    onLoadedMetadata: () => console.log('[Audio] Metadata loaded'),
  },
  render: (args) => (
    <div style={{ width: 400 }}>
      <Audio {...args} />
      <p className='mt-2 text-gray-500 text-xs'>
        Open the browser console to see event logs
      </p>
    </div>
  ),
};

/**
 * Audio player with looping enabled.
 * The audio will restart automatically when it ends.
 */
export const Looping: Story = {
  args: {
    title: 'Looping Audio',
    loop: true,
  },
  render: renderInWrapper,
};

/**
 * Audio player displaying an error state.
 * When audio fails to load, an error message is shown and controls are disabled.
 */
export const ErrorState: Story = {
  args: {
    title: 'audioFileName.flac',
    src: '/nonexistent-file.mp3',
    onError: (error) => console.log('[Audio] Error:', error?.message),
  },
  render: renderInWrapper,
};
