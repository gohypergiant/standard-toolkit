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
import { Switch } from './';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: {
    children: 'Label',
    isDisabled: false,
    labelPosition: 'end',
  },
  parameters: {
    docs: {
      subtitle: 'Toggle control for binary on/off states',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: Switch,
};

/**
 * Reproduces a scroll-jump bug: toggling a Switch inside a scrollable
 * ancestor causes the ancestor to scroll to the (1px, visually-hidden)
 * a11y input. To reproduce: scroll the container so the switch is
 * roughly centered, then toggle it — the container jumps.
 *
 * Root cause: react-aria's press handler calls inputRef.current.focus()
 * without { preventScroll: true }, and focus() defaults to running
 * scrollIntoView({ block: 'nearest' }) on the focused element.
 */
export const ScrollJumpRepro: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Scroll the container so the switch is centered, then toggle it. The container scrolls to the hidden 1px input.',
      },
    },
  },
  render: () => {
    const Filler = ({ count, prefix }: { count: number; prefix: string }) => {
      const lines = Array.from(
        { length: count },
        (_, i) =>
          `${prefix} line ${i + 1} — filler content to make the container scrollable.`,
      );
      return (
        <>
          {lines.map((text) => (
            <p key={text} style={{ margin: '8px 0' }}>
              {text}
            </p>
          ))}
        </>
      );
    };

    const ReproContainer = () => {
      const [enabled, setEnabled] = useState(false);
      return (
        <div
          style={{
            border: '1px solid var(--outline-static, #888)',
            height: 320,
            overflowY: 'auto',
            padding: 16,
            width: 480,
          }}
        >
          <Filler count={30} prefix='Above' />
          <Switch isSelected={enabled} onChange={setEnabled}>
            Toggle me — watch the scroll position
          </Switch>
          <Filler count={30} prefix='Below' />
        </div>
      );
    };

    return <ReproContainer />;
  },
};
