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
import {
  DATASET_JAN25_TO_JAN28,
  DATASET_JAN27_TO_JAN30,
  DATASET_JAN29_TO_FEB1,
} from './__fixtures__';
import { GanttRow } from './components/gantt-row';
import { BracketClose, BracketOpen } from './components/gantt-row/bracket';
import { GanttRowBlock } from './components/gantt-row/gantt-row-block';
import { Marker } from './components/gantt-row/marker';
import { Spacer } from './components/gantt-row/spacer';
import { TIMESCALE_OPTIONS } from './constants';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Timescale } from './types';

type GanttStoryControls = {
  datasetKey: keyof typeof datasetKeys;
  timescale: Timescale;
};

const datasetKeys: Record<string, typeof DATASET_JAN27_TO_JAN30> = {
  JAN25_TO_JAN28: DATASET_JAN25_TO_JAN28,
  JAN27_TO_JAN30: DATASET_JAN27_TO_JAN30,
  JAN29_TO_FEB1: DATASET_JAN29_TO_FEB1,
};

const meta = {
  title: 'Components/Gantt',
  args: {
    datasetKey: Object.keys(datasetKeys)[0] as keyof typeof datasetKeys,
    timescale: '1h',
  } satisfies GanttStoryControls,
  argTypes: {
    datasetKey: {
      control: {
        type: 'select',
      },
      options: Object.keys(datasetKeys),
    },
    timescale: {
      control: {
        type: 'select',
      },
      options: TIMESCALE_OPTIONS,
    },
  },
  render: (args: GanttStoryControls) => {
    const { datasetKey } = args;

    // biome-ignore lint/style/noNonNullAssertion: <not undefined>
    const dataset = datasetKeys[datasetKey]!;

    return (
      <div className='h-[360px]'>
        <Gantt
          startTimeMs={dataset.startTimeMs}
          endTimeMs={dataset.endTimeMs}
          timescale={args.timescale}
        >
          {dataset.rows.map(({ id, elements }) => (
            <GanttRow key={id}>
              {elements.map((element, index) => {
                switch (element.type) {
                  case 'block': {
                    const [startMs, endMs] = element.rangeMs;
                    return (
                      <GanttRowBlock
                        key={`${id}-block-${index}`}
                        id={`${id}-block-${index}`}
                        startMs={startMs}
                        endMs={endMs}
                        color={element.color}
                      />
                    );
                  }

                  case 'spacer': {
                    const [startMs, endMs] = element.rangeMs;

                    return (
                      <Spacer
                        key={`${id}-spacer-${index}`}
                        id={`${id}-spacer-${index}`}
                        startMs={startMs}
                        endMs={endMs}
                        color={element.color}
                      />
                    );
                  }

                  case 'bracket-close':
                  case 'bracket-open': {
                    const timeMs = element.timeMs;

                    return element.type === 'bracket-close' ? (
                      <BracketClose
                        key={`${id}-bracket-close-${index}`}
                        timeMs={timeMs}
                        color={element.color}
                      />
                    ) : (
                      <BracketOpen
                        key={`${id}-bracket-open-${index}`}
                        timeMs={timeMs}
                        color={element.color}
                      />
                    );
                  }

                  case 'marker': {
                    const timeMs = element.timeMs;
                    return (
                      <Marker
                        key={`${id}-marker-${index}`}
                        timeMs={timeMs}
                        color={element.color}
                      />
                    );
                  }

                  default:
                    return null;
                }
              })}
            </GanttRow>
          ))}
        </Gantt>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<GanttStoryControls>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
