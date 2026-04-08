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

import { useState } from 'react';
import { Button } from '../components/button';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundation/Animation',
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type AnimationDurationInfo = {
  name: string;
  token: string;
  useCase: string;
};

type AnimationEasingInfo = {
  name: string;
  token: string;
  curve: string;
  useCase: string;
};

const durations: AnimationDurationInfo[] = [
  {
    name: 'Instant',
    token: 'animation-duration-instant',
    useCase: 'Immediate feedback, no visible animation',
  },
  {
    name: 'Fast',
    token: 'animation-duration-fast',
    useCase: 'Micro-interactions, hover states, button presses',
  },
  {
    name: 'Normal',
    token: 'animation-duration-normal',
    useCase: 'Most UI transitions, panel opens, content reveals',
  },
  {
    name: 'Slow',
    token: 'animation-duration-slow',
    useCase: 'Complex layout changes, large panels, page transitions',
  },
];

const easings: AnimationEasingInfo[] = [
  {
    name: 'Standard',
    token: 'animation-easing-standard',
    curve: 'cubic-bezier(0.4, 0, 0.2, 1)',
    useCase:
      'Default for most animations - balanced acceleration and deceleration',
  },
  {
    name: 'Decelerate',
    token: 'animation-easing-decelerate',
    curve: 'cubic-bezier(0, 0, 0.2, 1)',
    useCase: 'Elements entering the view - starts fast, ends slow',
  },
  {
    name: 'Accelerate',
    token: 'animation-easing-accelerate',
    curve: 'cubic-bezier(0.4, 0, 1, 1)',
    useCase: 'Elements leaving the view - starts slow, ends fast',
  },
];

const DurationDemo = ({ duration }: { duration: AnimationDurationInfo }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const rootElement = document.documentElement;
  const computedValue = getComputedStyle(rootElement).getPropertyValue(
    `--${duration.token}`,
  );

  const handleAnimate = () => {
    if (isAnimating) {
      return; // Prevent clicking while animating
    }
    setIsAnimating(true);
    // Use computed duration for reset timeout
    const durationMs = Number.parseInt(computedValue, 10) || 160;
    setTimeout(() => setIsAnimating(false), durationMs + 200);
  };

  return (
    <div className='flex flex-col gap-m' key={duration.token}>
      <div className='flex flex-col gap-l'>
        <Button variant='filled' color='mono-bold' onClick={handleAnimate}>
          Animate
        </Button>
        <div
          className='h-20 w-20 rounded-full bg-interactive-bold'
          style={{
            transition: `transform var(--${duration.token}) var(--animation-easing-standard)`,
            transform: isAnimating ? 'translateX(200px)' : 'translateX(0)',
            willChange: 'transform',
          }}
        />
      </div>
      <div className='fg-primary-bold flex flex-col gap-xs font-display text-body-xs'>
        <span className='inline-flex gap-s'>
          {duration.name}
          <span className='fg-primary-muted text-body-xxs'>
            ({computedValue})
          </span>
        </span>
        <span className='fg-primary-muted max-w-400 font-sans text-body-xs'>
          {duration.useCase}
        </span>
      </div>
    </div>
  );
};

const EasingDemo = ({ easing }: { easing: AnimationEasingInfo }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnimate = () => {
    if (isAnimating) {
      return; // Prevent clicking while animating
    }
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 520); // 320ms duration + 200ms buffer
  };

  return (
    <div className='flex flex-col gap-m' key={easing.token}>
      <div className='flex flex-col gap-l'>
        <Button variant='filled' color='mono-bold' onClick={handleAnimate}>
          Animate
        </Button>
        <div
          className='h-20 w-20 rounded-full bg-interactive-bold'
          style={{
            transition: `transform var(--animation-duration-slow) var(--${easing.token})`,
            transform: isAnimating ? 'translateX(300px)' : 'translateX(0)',
            willChange: 'transform',
          }}
        />
      </div>
      <div className='fg-primary-bold flex flex-col gap-xs font-display text-body-xs'>
        <span>{easing.name}</span>
        <span className='fg-primary-muted text-body-xxs'>{easing.curve}</span>
        <span className='fg-primary-muted max-w-400 font-sans text-body-xs'>
          {easing.useCase}
        </span>
      </div>
    </div>
  );
};

export const Duration: Story = {
  render: () => {
    return (
      <div className='flex max-w-700 flex-col gap-xl p-xxl'>
        {durations.map((duration) => (
          <DurationDemo key={duration.token} duration={duration} />
        ))}
      </div>
    );
  },
};

export const Easing: Story = {
  render: () => {
    return (
      <div className='flex max-w-700 flex-col gap-xl p-xxl'>
        {easings.map((easing) => (
          <EasingDemo key={easing.token} easing={easing} />
        ))}
      </div>
    );
  },
};
