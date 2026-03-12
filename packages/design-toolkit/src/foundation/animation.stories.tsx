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
          <span className='fg-disabled text-body-xxs'>({computedValue})</span>
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
        <span className='fg-disabled text-body-xxs'>{easing.curve}</span>
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
              pressure, cognitive load, and high consequence for mistakes.
              Interfaces must communicate system state, interactivity, and
              changes clearly and immediately.
            </p>
            <p>
              Motion (animation and transitions) is not included in the design
              system for aesthetic purposes. Instead, it serves as a{' '}
              <strong>functional communication layer</strong> that helps users:
            </p>
            <ul className='ml-l flex list-disc flex-col gap-xs'>
              <li>Understand what just happened</li>
              <li>Understand what is interactive</li>
              <li>Maintain spatial and workflow orientation</li>
              <li>Interpret system status and feedback</li>
            </ul>
            <p>
              Without motion, interfaces often rely on abrupt visual changes
              that can be ambiguous, easy to miss, or cognitively expensive to
              interpret. The design system therefore provides purposeful,
              minimal motion patterns that support operational clarity while
              avoiding distraction.
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className='flex flex-col gap-m'>
          <h2 className='fg-primary-bold text-header-l'>
            Motion Design Principles
          </h2>
          <div className='fg-primary-muted text-body-s'>
            <p className='mb-m'>
              The design system follows four core motion principles:
            </p>
            <ol className='ml-l flex list-decimal flex-col gap-xs'>
              <li>
                <strong>Motion Explains Change</strong>
              </li>
              <li>
                <strong>Motion Preserves Context</strong>
              </li>
              <li>
                <strong>Motion Respects the User's Tempo</strong>
              </li>
              <li>
                <strong>Motion Is Functional, Not Decorative</strong>
              </li>
            </ol>
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
                provides causal feedback.
              </p>
              <ul className='ml-l flex list-disc flex-col gap-xs'>
                <li>Opening a panel expands from the trigger location</li>
                <li>
                  System updates transition rather than abruptly replacing
                  information
                </li>
              </ul>
              <p className='mt-xs'>
                Users can clearly connect action → result, reducing uncertainty
                and repeated interactions.
              </p>
            </div>

            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>
                Confirming Interaction
              </h3>
              <p className='mb-xs'>
                In high-stakes workflows, users need immediate confirmation that
                their action was registered. Motion provides micro-feedback such
                as:
              </p>
              <ul className='ml-l flex list-disc flex-col gap-xs'>
                <li>Button press response</li>
                <li>Selection transitions</li>
                <li>Drag interactions</li>
                {/* cspell:ignore affordances */}
                <li>Hover affordances</li>
              </ul>
              <p className='mt-xs'>Without this feedback, users may:</p>
              <ul className='ml-l flex list-disc flex-col gap-xs'>
                <li>Click multiple times</li>
                <li>Question whether the system responded</li>
                <li>Lose confidence in system responsiveness</li>
              </ul>
            </div>

            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>
                Preserving Spatial Orientation
              </h3>
              <p className='mb-xs'>Many operational interfaces contain:</p>
              <ul className='ml-l flex list-disc flex-col gap-xs'>
                <li>Layered information</li>
                <li>Map views</li>
                <li>Panels and overlays</li>
                <li>Filters and toggles</li>
                <li>Progressive disclosure</li>
              </ul>
              <p className='mt-xs'>
                When content appears or disappears instantly, users must
                mentally reconstruct where information came from or went. Motion
                preserves spatial continuity by showing where content
                originated, where it moved, and how it relates to the
                surrounding interface.
              </p>
            </div>

            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>
                Guiding Attention
              </h3>
              <p className='mb-xs'>
                Operational systems often present dense information
                environments. Motion can be used sparingly to guide attention to
                meaningful changes:
              </p>
              <ul className='ml-l flex list-disc flex-col gap-xs'>
                <li>Emphasizing an alert state transition</li>
                <li>Indicating that filtered results have updated</li>
              </ul>
              <p className='mt-xs'>
                Motion is used to draw attention only to meaningful events, not
                decorative effects.
              </p>
            </div>

            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>
                Reducing Cognitive Load
              </h3>
              <p>
                Instant changes require users to infer what changed. Motion
                externalizes that change. Instead of the user asking "What
                changed?" motion answers: "This element moved here; this layer
                appeared; this panel expanded." The result is less cognitive
                effort interpreting the interface.
              </p>
            </div>
          </div>
        </div>

        {/* Duration Tokens */}
        <div className='flex flex-col gap-m'>
          <h2 className='fg-primary-bold text-header-l'>Duration</h2>
          <p className='fg-primary-muted text-body-s'>
            Animations must complete quickly so they do not slow workflows.
            These durations balance clarity with speed.
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
              <p className='mb-xs'>Users must always be able to:</p>
              <ul className='ml-l flex list-disc flex-col gap-xs'>
                <li>Issue another command</li>
                <li>Change context</li>
                <li>Cancel actions</li>
              </ul>
              <p className='mt-xs'>Motion should never block interaction.</p>
            </div>
            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>
                Reduced When Needed
              </h3>
              <p className='mb-xs'>Operational contexts may include:</p>
              <ul className='ml-l flex list-disc flex-col gap-xs'>
                <li>Fatigue</li>
                <li>Motion sensitivity</li>
                <li>High-stress environments</li>
              </ul>
              <p className='mt-xs'>
                The system supports reduced motion modes where appropriate. Use{' '}
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
            </p>
          </div>
          <div className='fg-primary-muted flex flex-col gap-m text-body-s'>
            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>
                Decorative Animation
              </h3>
              <p>
                Animations that exist only for visual appeal add no functional
                value and can distract from critical information.
              </p>
            </div>
            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>
                Attention-Grabbing Effects
              </h3>
              <p className='mb-xs'>Examples to avoid:</p>
              <ul className='ml-l flex list-disc flex-col gap-xs'>
                <li>Bounces</li>
                <li>Elastic effects</li>
                <li>Dramatic easing</li>
                <li>Exaggerated motion</li>
              </ul>
              <p className='mt-xs'>
                These can distract from critical information in operational
                interfaces.
              </p>
            </div>
            <div>
              <h3 className='fg-primary-bold mb-xs text-body-m'>
                Slow Cinematic Transitions
              </h3>
              <p>
                Operational tools prioritize speed and clarity over visual
                storytelling. Keep animations brief and functional.
              </p>
            </div>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className='flex flex-col gap-m'>
          <h2 className='fg-primary-bold text-header-l'>Where to Use Motion</h2>
          <div className='fg-primary-muted flex flex-col gap-s text-body-s'>
            <p>
              <strong>Interaction Feedback:</strong>
            </p>
            <p>
              <strong>Layout Changes:</strong>
            </p>
            <p>
              <strong>Data Updates:</strong>
            </p>
            <p>
              <strong>Status and Alerts:</strong>
            </p>
          </div>
        </div>
      </div>
    );
  },
};
