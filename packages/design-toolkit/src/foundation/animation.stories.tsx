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
  // cspell:ignore autodocs
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

export const Animation: Story = {
  render: () => {
    return (
      <div className='flex max-w-700 flex-col gap-xxl p-xxl'>
        {/* Introduction */}
        <div className='flex flex-col gap-m'>
          <h1 className='fg-primary-bold text-header-xl'>Animation</h1>
          <div className='fg-primary-muted flex flex-col gap-m text-body-s'>
            <p>
              In mission-critical environments, users operate under time
              pressure and cognitive load, with high consequence for mistakes.
              Interfaces must communicate system state, interactivity, and
              changes clearly and immediately.
            </p>
            <p>
              Animations and transitions are included in the design system not
              just for aesthetic purposes, but Instead serve as a functional
              communication layer that helps operators understand what is
              interactive, where changes are occurring, and how the system is
              responding to their actions. Thoughtful motion design reduces
              cognitive load and supports efficient, confident operation. The
              design system provides purposeful, minimal motion patterns that
              support operational clarity while avoiding distraction.
            </p>
          </div>
        </div>

        {/* Why Motion Matters */}
        <div className='flex flex-col gap-m'>
          <h2 className='fg-primary-bold text-header-l'>Why Motion Matters</h2>
          <div className='fg-primary-muted flex flex-col gap-m text-body-s'>
            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>
                Communicating State Change
              </h3>
              <p className='mb-xs'>
                Operational software frequently updates in response to user
                actions or system events. Without motion, these changes can
                appear sudden or disconnected from the user's action. Motion
                provides causal feedback. The goal of motion is to clearly
                connect operator action to result, reducing uncertainty and
                repeated interactions.
              </p>
            </div>

            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>
                Confirming Interaction
              </h3>
              <p className='mb-xs'>
                In high-stakes workflows, users need immediate confirmation that
                their action was registered. Motion provides key micro-feedback.
                Without this feedback, users may click multiple times, question
                whether the system responded, and even lose confidence in system
                responsiveness
              </p>
            </div>

            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>
                Preserving Orientation
              </h3>
              <p className='mb-xs'>
                Many operational interfaces contain layered information, panels,
                overlays, and progressively disclosed elements. When content
                appears or disappears instantly, users must mentally reconstruct
                where information came from or went. Motion preserves spatial
                continuity by showing where content originated, where it moved,
                and how it relates to the surrounding interface.
              </p>
            </div>

            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>
                Guiding Attention
              </h3>
              <p className='mb-xs'>
                Operational systems often present dense information
                environments. Motion can be used sparingly to guide attention to
                meaningful changes. Motion is used to draw attention only to
                meaningful events, not decorative effects.
              </p>
            </div>
          </div>
        </div>

        {/* Duration Tokens */}
        <div className='flex flex-col gap-m'>
          <h2 className='fg-primary-bold text-header-l'>Duration</h2>
          <p className='fg-primary-muted text-body-s'>
            Here are the available animation tokens.
          </p>
          <div className='flex flex-col gap-xl'>
            {durations.map((duration) => (
              <DurationDemo key={duration.token} duration={duration} />
            ))}
          </div>
        </div>

        {/* Easing Tokens */}
        <div className='flex flex-col gap-m'>
          <h2 className='fg-primary-bold text-header-l'>Easing</h2>
          <p className='fg-primary-muted text-body-s'>
            Easing curves control acceleration, making animations feel natural
            and purposeful.
          </p>
          <div className='flex flex-col gap-xl'>
            {easings.map((easing) => (
              <EasingDemo key={easing.token} easing={easing} />
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div className='flex flex-col gap-m'>
          <h2 className='fg-primary-bold text-header-l'>
            Constraints for Mission-Critical Software
          </h2>
          <div className='fg-primary-muted text-body-s'>
            <p className='mb-m'>
              Unlike consumer applications, motion must respect strict
              operational constraints. Motion in the design system must always
              be:
            </p>
          </div>
          <div className='fg-primary-muted flex flex-col gap-m text-body-s'>
            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>Subtle</h3>
              <p>
                Motion should support comprehension without drawing attention to
                itself. Users should perceive the information change, not the
                animation.
              </p>
            </div>
            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>Fast</h3>
              <p>
                Animations must complete quickly so they do not slow workflows.
                Typical ranges are 80-320ms. Longer animations are avoided.
              </p>
            </div>
            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>Predictable</h3>
              <p>
                Motion should follow consistent patterns across the system.
                Consistency reduces learning cost.
              </p>
            </div>
            <div>
              {/* cspell:ignore Interruptible */}
              <h3 className='fg-primary-bold mb-xs text-body-m'>
                Interruptible
              </h3>
              <p className='mb-xs'>
                Users must always be able to issue another command, change
                contexts, or cancel an action. Motion should never block
                interaction.
              </p>
            </div>
            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>
                Reduced When Needed
              </h3>
              <p className='mb-xs'>
                Operational contexts may include fatigue, motion sensitivity,
                and high-stress environments, or high stress. The system
                supports reduced motion modes where appropriate. Use{' '}
                <code className='font-display'>prefers-reduced-motion</code> to
                respect user preferences.
              </p>
            </div>
          </div>
        </div>

        {/* What to Avoid */}
        <div className='flex flex-col gap-m'>
          <h2 className='fg-primary-bold text-header-l'>
            What Motion Is Not Used For
          </h2>
          <div className='fg-primary-muted text-body-s'>
            <p className='mb-m'>
              To maintain operational clarity, the design system explicitly
              avoids:
              <ul className='ml-l flex list-disc flex-col gap-xs'>
                <li>Bounces</li>
                <li>Elastic effects</li>
                <li>Dramatic easing</li>
                <li>Exaggerated motion</li>
                <li>Slow cinematic transitions</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    );
  },
};
