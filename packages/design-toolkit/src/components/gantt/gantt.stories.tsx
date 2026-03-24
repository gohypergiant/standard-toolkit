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

import Placeholder from '@accelint/icons/placeholder';
import { useMemo } from 'react';
import { Icon } from '../icon';
import { GanttProvider } from './';
import {
  CURRENT_TIME_MS,
  DATASET_JAN25_TO_JAN28,
  DATASET_JAN27_TO_JAN30,
  DATASET_JAN29_TO_FEB1,
} from './__fixtures__';
import { GanttContentContainer } from './components/containers/external/gantt-content-container';
import { GanttPanelContainer } from './components/containers/external/gantt-panel-container';
import { GanttRow } from './components/gantt-row';
import { Block } from './components/gantt-row/block';
import { BracketClose, BracketOpen } from './components/gantt-row/bracket';
import { IconMarker } from './components/gantt-row/icon-marker';
import { Marker } from './components/gantt-row/marker';
import { Spacer } from './components/gantt-row/spacer';
import { PanelRow } from './components/panel-row';
import { TIMESCALE_OPTIONS } from './constants';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Timescale } from './types';

type GanttStoryControls = {
  datasetKey: keyof typeof datasetKeys;
  timescale: Timescale;
  currentTimeMs: number;
  rowHeightPx: string;
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
    currentTimeMs: CURRENT_TIME_MS,
    timescale: '1h',
    rowHeightPx: '40',
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
    rowHeightPx: {
      control: {
        type: 'select',
      },
      options: ['35', '40', '60', '80'],
    },
  },
  render: (args: GanttStoryControls) => {
    const { datasetKey } = args;

    // biome-ignore lint/style/noNonNullAssertion: <not undefined>
    const dataset = datasetKeys[datasetKey]!;

    const thresholdProps = useMemo(
      () => ({
        threshold: {
          timescaleMultipleDistance: 3,
          rowIndexBoundaryDistance: 2,
        },
        onThresholdMet: console.log,
      }),
      [],
    );

    const timestampHour = (timestampMs: number) => {
      const value = new Date(timestampMs).getUTCHours().toString();

      return value.length === 1 ? `0${value}` : value;
    };

    const timestampMinutes = (timestampMs: number) => {
      const value = new Date(timestampMs).getUTCMinutes().toString();

      return value.length === 1 ? `0${value}` : value;
    };

    const timestampLabel = (
      startTimestampMs: number,
      endTimestampMs: number,
    ) => {
      return `${timestampHour(startTimestampMs)}:${timestampMinutes(startTimestampMs)}--${timestampHour(endTimestampMs)}:${timestampMinutes(endTimestampMs)}`;
    };

    return (
      <div className='h-[480px]'>
        <GanttProvider
          startTimeMs={dataset.startTimeMs}
          endTimeMs={dataset.endTimeMs}
          currentTimeMs={args.currentTimeMs}
          timescale={args.timescale}
          thresholdProps={thresholdProps}
          rowHeightPx={Number(args.rowHeightPx)}
        >
          <GanttPanelContainer>
            {dataset.rows.map(({ id, trackNumber, description }) => (
              <PanelRow key={id}>
                <div className='fg-primary-bold flex items-center font-display text-body-s'>
                  <span>{trackNumber}</span>
                  {description && (
                    <span className='fg-inverse-muted'>
                      &nbsp;- {description}
                    </span>
                  )}
                </div>
              </PanelRow>
            ))}
          </GanttPanelContainer>
          <GanttContentContainer>
            {dataset.rows.map(({ id, elements }) => (
              <GanttRow key={id}>
                {elements.map((element, index) => {
                  switch (element.type) {
                    case 'block': {
                      const [startMs, endMs] = element.rangeMs;
                      return (
                        <Block
                          key={`${id}-block-${index}`}
                          id={`${id}-block-${index}`}
                          startMs={startMs}
                          endMs={endMs}
                          color={element.color}
                        >
                          {element.color === 'critical' ||
                          element.color === 'serious' ? (
                            <div className='flex flex-col text-body-xs'>
                              <span>JAMMING ENTRY</span>
                              <span>{timestampLabel(startMs, endMs)}</span>
                            </div>
                          ) : null}
                        </Block>
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

                    case 'icon-marker': {
                      const timeMs = element.timeMs;
                      return (
                        <IconMarker
                          key={`${id}-icon-marker-${index}`}
                          timeMs={timeMs}
                          color={element.color}
                        >
                          <Icon size='small'>
                            <Placeholder />
                          </Icon>
                        </IconMarker>
                      );
                    }

                    default:
                      return null;
                  }
                })}
              </GanttRow>
            ))}
          </GanttContentContainer>
        </GanttProvider>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<GanttStoryControls>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    datasetKey: 'JAN27_TO_JAN30',
    timescale: '2h',
  },
};
