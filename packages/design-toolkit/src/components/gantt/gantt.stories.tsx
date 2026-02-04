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

import { Gantt } from './';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Tuesday, Jan 27, 2026 at 12:00 AM UTC
const START_TIME_MS = 1769472000000;
// Friday, Jan 30, 2026 at 8:00 AM UTC
const END_TIME_MS = 1769760000000;

const meta = {
  title: 'Components/Gantt',
  component: Gantt,
  args: {
    startTimeMs: START_TIME_MS,
    endTimeMs: END_TIME_MS,
    timescale: '1h',
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Gantt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Gantt {...args} />,
};
