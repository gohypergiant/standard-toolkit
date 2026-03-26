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
import { Audio } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Audio',
  component: Audio,
  args: {
    src: '/test.mp3',
    classNames: { container: 'w-[400px]' },
    isDisabled: false,
    muted: false,
    autoPlay: false,
    loop: false,
    playbackRates: [1, 2, 3],
  },
  argTypes: {
    classNames: {
      control: 'object',
      description: 'Class names for sub-elements (container, title, etc.)',
    },
    src: {
      control: 'text',
      description: 'Audio source URL',
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
} satisfies Meta<typeof Audio>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default audio player with standard controls.
 * Includes play/pause, seek, volume, and playback rate controls.
 */
export const Default: Story = {};

/**
 * Audio player with a title displayed above the controls.
 * Useful for showing the filename or track name.
 */
export const WithTitle: Story = {
  args: {
    title: 'Sample Audio Track.mp3',
  },
};

/**
 * Audio player with event callbacks.
 * Open the Storybook Actions panel to see the events being logged.
 */
export const Events: Story = {
  args: {
    title: 'Audio with Event Callbacks',
    onPlay: action('onPlay'),
    onPause: action('onPause'),
    onEnded: action('onEnded'),
    onTimeUpdate: action('onTimeUpdate'),
    onLoadedMetadata: action('onLoadedMetadata'),
  },
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
};

/**
 * Audio player displaying an error state.
 * When audio fails to load, an error message is shown and controls are disabled.
 */
export const ErrorState: Story = {
  args: {
    title: 'audioFileName.flac',
    src: '/nonexistent-file.mp3',
    onError: action('onError'),
  },
};

/**
 * Audio player with keyboard shortcuts disabled.
 * Useful when embedding in forms or apps with custom hotkey systems.
 */
export const NoHotkeys: Story = {
  args: {
    title: 'No Keyboard Shortcuts',
    noHotkeys: true,
  },
};
