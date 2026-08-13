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

export const ScrollPreventionTest: Story = {
  render: () => (
    <div
      style={{
        height: '400px',
        overflow: 'auto',
        border: '2px solid #ccc',
        padding: '20px',
      }}
    >
      <p>
        Scroll down and click switches - the viewport should not jump or scroll
      </p>
      <div style={{ height: '200px' }} />
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} style={{ marginBottom: '20px' }}>
          <Switch>Switch {i + 1}</Switch>
        </div>
      ))}
      <div style={{ height: '200px' }} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Tests that clicking switches does not cause unwanted scroll-into-view behavior. Scroll within the container and click switches - the viewport should remain stable.',
      },
    },
  },
};
