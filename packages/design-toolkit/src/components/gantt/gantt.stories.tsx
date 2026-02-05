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

// Tuesday, Jan 27, 2026 at 5:30 AM UTC (1.5-hour block: 5:30 AM - 7:00 AM)
const BLOCK5_START_MS = 1769491800000;
const BLOCK5_END_MS = 1769497200000;

// Tuesday, Jan 27, 2026 at 6:00 PM UTC (2-hour block: 6:00 PM - 8:00 PM)
const BLOCK6_START_MS = 1769536800000;
const BLOCK6_END_MS = 1769544000000;

// Wednesday, Jan 28, 2026 at 1:00 AM UTC (3-hour block: 1:00 AM - 4:00 AM)
const BLOCK7_START_MS = 1769562000000;
const BLOCK7_END_MS = 1769572800000;

// Wednesday, Jan 28, 2026 at 9:00 AM UTC (2-hour block: 9:00 AM - 11:00 AM) // overlaps BLOCK_START/BLOCK_END
const BLOCK8_START_MS = 1769590800000;
const BLOCK8_END_MS = 1769598000000;

// Wednesday, Jan 28, 2026 at 11:30 PM UTC (3-hour block: 11:30 PM - 2:30 AM next day)
const BLOCK9_START_MS = 1769643000000;
const BLOCK9_END_MS = 1769653800000;

// Thursday, Jan 29, 2026 at 1:00 PM UTC (3-hour block: 1:00 PM - 4:00 PM) // overlaps BLOCK2
const BLOCK10_START_MS = 1769691600000;
const BLOCK10_END_MS = 1769702400000;

// Thursday, Jan 29, 2026 at 10:00 PM UTC (3-hour block: 10:00 PM - 1:00 AM next day) // overlaps BLOCK3
const BLOCK11_START_MS = 1769724000000;
const BLOCK11_END_MS = 1769734800000;

// Friday, Jan 30, 2026 at 4:00 AM UTC (4-hour block: 4:00 AM - 8:00 AM) // ends exactly at END_TIME_MS
const BLOCK12_START_MS = 1769745600000;
const BLOCK12_END_MS = 1769760000000;

// Tuesday, Jan 27, 2026 at 2:00 AM UTC (2-hour block: 2:00 AM - 4:00 AM)
const BLOCK13_START_MS = 1769479200000;
const BLOCK13_END_MS = 1769486400000;

// Tuesday, Jan 27, 2026 at 9:00 AM UTC (1-hour block: 9:00 AM - 10:00 AM)
const BLOCK14_START_MS = 1769504400000;
const BLOCK14_END_MS = 1769508000000;

// Tuesday, Jan 27, 2026 at 3:00 PM UTC (3-hour block: 3:00 PM - 6:00 PM)
const BLOCK15_START_MS = 1769526000000;
const BLOCK15_END_MS = 1769536800000;

// Wednesday, Jan 28, 2026 at 8:30 AM UTC (2.5-hour block: 8:30 AM - 11:00 AM) // overlaps BLOCK_START
const BLOCK16_START_MS = 1769589000000;
const BLOCK16_END_MS = 1769598000000;

// Wednesday, Jan 28, 2026 at 3:00 PM UTC (4-hour block: 3:00 PM - 7:00 PM)
const BLOCK17_START_MS = 1769612400000;
const BLOCK17_END_MS = 1769626800000;

// Thursday, Jan 29, 2026 at 6:00 AM UTC (2-hour block: 6:00 AM - 8:00 AM)
const BLOCK18_START_MS = 1769676000000;
const BLOCK18_END_MS = 1769683200000;

// Thursday, Jan 29, 2026 at 4:30 PM UTC (2-hour block: 4:30 PM - 6:30 PM) // overlaps BLOCK2
const BLOCK19_START_MS = 1769704200000;
const BLOCK19_END_MS = 1769711400000;

// Friday, Jan 30, 2026 at 12:30 AM UTC (3.5-hour block: 12:30 AM - 4:00 AM)
const BLOCK20_START_MS = 1769725800000;
const BLOCK20_END_MS = 1769738400000;

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
      </GanttRow>
      <GanttRow>
        <GanttRowBlock
          id='block-4'
          startMs={BLOCK4_START_MS}
          endMs={BLOCK4_END_MS}
        />
        <GanttRowBlock
          id='block-5'
          startMs={BLOCK5_START_MS}
          endMs={BLOCK5_END_MS}
        />
        <GanttRowBlock
          id='block-13'
          startMs={BLOCK13_START_MS}
          endMs={BLOCK13_END_MS}
        />
        <GanttRowBlock
          id='block-14'
          startMs={BLOCK14_START_MS}
          endMs={BLOCK14_END_MS}
        />
      </GanttRow>
      <GanttRow>
        <GanttRowBlock
          id='block-6'
          startMs={BLOCK6_START_MS}
          endMs={BLOCK6_END_MS}
        />
        <GanttRowBlock
          id='block-7'
          startMs={BLOCK7_START_MS}
          endMs={BLOCK7_END_MS}
        />
        <GanttRowBlock
          id='block-8'
          startMs={BLOCK8_START_MS}
          endMs={BLOCK8_END_MS}
        />
        <GanttRowBlock
          id='block-9'
          startMs={BLOCK9_START_MS}
          endMs={BLOCK9_END_MS}
        />
      </GanttRow>
      <GanttRow>
        <GanttRowBlock
          id='block-10'
          startMs={BLOCK10_START_MS}
          endMs={BLOCK10_END_MS}
        />
        <GanttRowBlock
          id='block-15'
          startMs={BLOCK15_START_MS}
          endMs={BLOCK15_END_MS}
        />
      </GanttRow>
      <GanttRow>
        <GanttRowBlock
          id='block-16'
          startMs={BLOCK16_START_MS}
          endMs={BLOCK16_END_MS}
        />
        <GanttRowBlock
          id='block-17'
          startMs={BLOCK17_START_MS}
          endMs={BLOCK17_END_MS}
        />
        <GanttRowBlock
          id='block-18'
          startMs={BLOCK18_START_MS}
          endMs={BLOCK18_END_MS}
        />
        <GanttRowBlock
          id='block-19'
          startMs={BLOCK19_START_MS}
          endMs={BLOCK19_END_MS}
        />
      </GanttRow>
      <GanttRow>
        <GanttRowBlock
          id='block-11'
          startMs={BLOCK11_START_MS}
          endMs={BLOCK11_END_MS}
        />
        <GanttRowBlock
          id='block-12'
          startMs={BLOCK12_START_MS}
          endMs={BLOCK12_END_MS}
        />
        <GanttRowBlock
          id='block-20'
          startMs={BLOCK20_START_MS}
          endMs={BLOCK20_END_MS}
        />
      </GanttRow>
    </Gantt>
  ),
};
