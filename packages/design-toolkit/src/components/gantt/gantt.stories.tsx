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
import { END_TIME_MS, ROWS, START_TIME_MS } from './__fixtures__';
import { GanttRow } from './components/gantt-row';
import { CloseBracket, OpenBracket } from './components/gantt-row/bracket';
import { GanttRowBlock } from './components/gantt-row/gantt-row-block';
import { Spacer } from './components/gantt-row/spacer';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
    // consumer-set height to demonstrate scroll behavior with virtualized rows
    <div className='h-[360px]'>
      <Gantt {...args}>
        {ROWS.map(({ id, elements }) => (
          <GanttRow key={id}>
            {elements.map((element, index) => {
              if (element.type === 'block') {
                const [startMs, endMs] = element.rangeMs;
                return (
                  <GanttRowBlock
                    key={`${id}-block-${index}`}
                    id={`${id}-block-${index}`}
                    startMs={startMs}
                    endMs={endMs}
                  />
                );
              }

              if (element.type === 'spacer') {
                const [startMs, endMs] = element.rangeMs;

                return (
                  <Spacer
                    key={`${id}-spacer-${index}`}
                    id={`${id}-spacer-${index}`}
                    startMs={startMs}
                    endMs={endMs}
                  />
                );
              }

              if (
                element.type === 'close-bracket' ||
                element.type === 'open-bracket'
              ) {
                return element.type === 'open-bracket' ? (
                  <OpenBracket
                    key={`${id}-open-bracket-${index}`}
                    timeMs={element.timeMs}
                  />
                ) : (
                  <CloseBracket
                    key={`${id}-close-bracket-${index}`}
                    timeMs={element.timeMs}
                  />
                );
              }

              return null;
            })}
          </GanttRow>
        ))}
      </Gantt>
      {/* <CloseBracket /> */}
    </div>
  ),
};
