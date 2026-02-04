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
import { GanttRow } from './components/gantt-row';
import { GanttRowBlock } from './components/gantt-row-block';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Tuesday, Jan 27, 2026 at 12:00 AM UTC
const START_TIME_MS = 1769472000000;

// Wednesday, Jan 28, 2026 at 10:00 AM UTC (2-hour block: 10:00 AM - 12:00 PM)
const BLOCK_START_MS = 1769594400000;
const BLOCK_END_MS = 1769601600000;

// Thursday, Jan 29, 2026 at 2:00 PM UTC (3-hour block: 2:00 PM - 5:00 PM)
const BLOCK2_START_MS = 1769688000000;
const BLOCK2_END_MS = 1769698800000;

// Thursday, Jan 29, 2026 at 11:00 PM UTC (1-hour block: 11:00 PM - 12:00 AM)
const BLOCK3_START_MS = 1769720400000;
const BLOCK3_END_MS = 1769724000000;

// Friday, Jan 30, 2026 at 6:00 AM UTC (4-hour block extends past END_TIME_MS: 6:00 AM - 10:00 AM)
const BLOCK4_START_MS = 1769752800000;
const BLOCK4_END_MS = 1769767200000;

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
  render: (args) => (
    <Gantt {...args}>
      <GanttRow>
        <GanttRowBlock
          id='block-1'
          startMs={BLOCK_START_MS}
          endMs={BLOCK_END_MS}
        />
        <GanttRowBlock
          id='block-2'
          startMs={BLOCK2_START_MS}
          endMs={BLOCK2_END_MS}
        />
        <GanttRowBlock
          id='block-3'
          startMs={BLOCK3_START_MS}
          endMs={BLOCK3_END_MS}
        />
        <GanttRowBlock
          id='block-4'
          startMs={BLOCK4_START_MS}
          endMs={BLOCK4_END_MS}
        />
      </GanttRow>
    </Gantt>
  ),
};
