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

import { action } from 'storybook/actions';
import { Video } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Video',
  component: Video,
  args: {
    src: '/demo.mov',
    classNames: { container: 'w-[640px]' },
    isDisabled: false,
    muted: false,
    autoPlay: false,
    loop: false,
    playbackRates: [1, 2, 3],
  },
  argTypes: {
    classNames: {
      control: 'object',
      description: 'Class names for sub-elements (container, video, etc.)',
    },
    src: {
      control: 'text',
      description: 'Video source URL',
    },
    poster: {
      control: 'text',
      description: 'Poster image URL displayed before playback',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disable all video controls',
    },
    autoPlay: {
      control: 'boolean',
      description: 'Autoplay (note: browsers may block this)',
    },
    loop: {
      control: 'boolean',
      description: 'Loop the video when it ends',
    },
    muted: {
      control: 'boolean',
      description: 'Start the video muted',
    },
    preload: {
      control: 'select',
      options: ['none', 'metadata', 'auto'],
      description: 'Preload behavior for the video element',
    },
    playbackRates: {
      control: 'object',
      description: 'Array of playback rate options (e.g., [0.5, 1, 1.5, 2])',
    },
    noHotkeys: {
      control: 'boolean',
      description: 'Disable all keyboard shortcuts',
    },
    noVolumePref: {
      control: 'boolean',
      description: 'Disable volume persistence to localStorage',
    },
    noMutedPref: {
      control: 'boolean',
      description: 'Disable muted state persistence to localStorage',
    },
  },
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default video player with standard controls.
 * Includes play/pause, seek, volume, playback rate, and fullscreen controls.
 */
export const Default: Story = {};

/**
 * Video player with a poster image displayed before playback.
 * The poster is shown until the user plays the video.
 */
export const WithPoster: Story = {
  args: {
    poster: '/demo-poster.png',
  },
};

/**
 * Video player with event callbacks.
 * Open the Storybook Actions panel to see the events being logged.
 */
export const Events: Story = {
  args: {
    onEnded: action('onEnded'),
    onTimeUpdate: action('onTimeUpdate'),
  },
};

/**
 * Video player with looping enabled.
 * The video will restart automatically when it ends.
 */
export const Looping: Story = {
  args: {
    loop: true,
  },
};

/**
 * Video player displaying an error state.
 * When video fails to load, an error message is shown and controls are disabled.
 */
export const ErrorState: Story = {
  args: {
    src: '/nonexistent-file.mp4',
    onError: action('onError'),
  },
};

/**
 * Video player with keyboard shortcuts disabled.
 * Useful when embedding in forms or apps with custom hotkey systems.
 */
export const NoHotkeys: Story = {
  args: {
    noHotkeys: true,
  },
};
