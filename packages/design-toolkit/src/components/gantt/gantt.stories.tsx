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
import {
  Gantt,
  GanttBlock,
  GanttBracketClose,
  GanttBracketOpen,
  GanttContentContainer,
  GanttIconMarker,
  GanttMarker,
  GanttPanelContainer,
  GanttPanelRow,
  GanttRow,
  GanttSpacer,
} from '.';
import {
  CURRENT_TIME_MS,
  DATASET_JAN25_TO_JAN28,
  DATASET_JAN27_TO_JAN30,
  DATASET_JAN29_TO_FEB1,
} from './__fixtures__';
import { TIMESCALE_OPTIONS } from './constants';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Timescale } from './types';

const datasetKeys: Record<string, typeof DATASET_JAN27_TO_JAN30> = {
  JAN25_TO_JAN28: DATASET_JAN25_TO_JAN28,
  JAN27_TO_JAN30: DATASET_JAN27_TO_JAN30,
  JAN29_TO_FEB1: DATASET_JAN29_TO_FEB1,
};

type StoryControls = {
  currentTimeMs: number;
  timescale: Timescale;
  rowHeightPx: string;
  datasetKey: keyof typeof datasetKeys;
};

const meta: Meta<StoryControls> = {
  title: 'Components/Gantt',
  args: {
    currentTimeMs: CURRENT_TIME_MS,
    timescale: '1h',
    rowHeightPx: '40',
  },
  argTypes: {
    datasetKey: {
      control: 'select',
      options: Object.keys(datasetKeys),
    },
    timescale: {
      control: 'select',
      options: TIMESCALE_OPTIONS,
    },
    rowHeightPx: {
      control: 'select',
      options: ['35', '40', '60', '80'],
    },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DatasetDriven: Story = {
  render: (args) => {
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
        <Gantt
          startTimeMs={dataset.startTimeMs}
          endTimeMs={dataset.endTimeMs}
          currentTimeMs={args.currentTimeMs}
          timescale={args.timescale}
          thresholdProps={thresholdProps}
          rowHeightPx={Number(args.rowHeightPx)}
        >
          <GanttPanelContainer>
            {dataset.rows.map(({ id, trackNumber, description }) => (
              <GanttPanelRow key={id}>
                <div className='fg-primary-bold flex items-center font-display text-body-s'>
                  <span>{trackNumber}</span>
                  {description && (
                    <span className='fg-inverse-muted'>
                      &nbsp;- {description}
                    </span>
                  )}
                </div>
              </GanttPanelRow>
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
                        <GanttBlock
                          key={`${id}-block-${index}`}
                          id={`${id}-block-${index}`}
                          startTimeMs={startMs}
                          endTimeMs={endMs}
                          color={element.color}
                        >
                          {element.color === 'critical' ||
                          element.color === 'serious' ? (
                            <div className='flex flex-col text-body-xs'>
                              <span>JAMMING ENTRY</span>
                              <span>{timestampLabel(startMs, endMs)}</span>
                            </div>
                          ) : null}
                        </GanttBlock>
                      );
                    }

                    case 'spacer': {
                      const [startMs, endMs] = element.rangeMs;

                      return (
                        <GanttSpacer
                          key={`${id}-spacer-${index}`}
                          id={`${id}-spacer-${index}`}
                          startTimeMs={startMs}
                          endTimeMs={endMs}
                          color={element.color}
                        />
                      );
                    }

                    case 'bracket-close':
                    case 'bracket-open': {
                      const timeMs = element.timeMs;

                      return element.type === 'bracket-close' ? (
                        <GanttBracketClose
                          key={`${id}-bracket-close-${index}`}
                          timeMs={timeMs}
                          color={element.color}
                        />
                      ) : (
                        <GanttBracketOpen
                          key={`${id}-bracket-open-${index}`}
                          timeMs={timeMs}
                          color={element.color}
                        />
                      );
                    }

                    case 'marker': {
                      const timeMs = element.timeMs;
                      return (
                        <GanttMarker
                          key={`${id}-marker-${index}`}
                          timeMs={timeMs}
                          color={element.color}
                        />
                      );
                    }

                    case 'icon-marker': {
                      const timeMs = element.timeMs;
                      return (
                        <GanttIconMarker
                          key={`${id}-icon-marker-${index}`}
                          timeMs={timeMs}
                          color={element.color}
                        >
                          <Icon size='small'>
                            <Placeholder />
                          </Icon>
                        </GanttIconMarker>
                      );
                    }

                    default:
                      return null;
                  }
                })}
              </GanttRow>
            ))}
          </GanttContentContainer>
        </Gantt>
      </div>
    );
  },
  args: {
    datasetKey: Object.keys(datasetKeys)[1] as keyof typeof datasetKeys,
    timescale: '2h',
    rowHeightPx: '40',
    currentTimeMs: CURRENT_TIME_MS,
  },
};

export const Static: Story = {
  render: () => {
    // Define time boundaries
    const startTimeMs = 1769472000000; // Tuesday, Jan 27, 2026 at 12:00 AM UTC
    const endTimeMs = 1769760000000; // Friday, Jan 30, 2026 at 8:00 AM UTC
    const currentTimeMs = 1769583600000; // Wed Jan 28, 2026 at 7:00 AM UTC

    return (
      <div className='h-[160px]'>
        <Gantt
          startTimeMs={startTimeMs}
          endTimeMs={endTimeMs}
          currentTimeMs={currentTimeMs}
          timescale='1h'
          rowHeightPx={40}
        >
          <GanttPanelContainer>
            <GanttPanelRow>
              <span className='fg-primary-bold font-display text-body-s'>
                KC-135
              </span>
              <span className='fg-inverse-muted text-body-s'>
                &nbsp;- Aerial Refueling
              </span>
            </GanttPanelRow>
            <GanttPanelRow>
              <span className='fg-primary-bold font-display text-body-s'>
                F-35
              </span>
              <span className='fg-inverse-muted text-body-s'>
                &nbsp;- Early Precision
              </span>
            </GanttPanelRow>
          </GanttPanelContainer>

          <GanttContentContainer>
            <GanttRow>
              {/* Row 1 elements */}
              <GanttBlock
                startTimeMs={1769473800000} // Tue Jan 27 — 12:30 AM
                endTimeMs={1769479200000} // Tue Jan 27 — 2:00 AM
                color='serious'
              />
              <GanttSpacer
                startTimeMs={1769479200000} // Tue Jan 27 — 2:00 AM
                endTimeMs={1769479500000} // Tue Jan 27 — 2:05 AM
              />
              <GanttBlock
                startTimeMs={1769479500000} // Tue Jan 27 — 2:05 AM
                endTimeMs={1769481900000} // Tue Jan 27 — 2:45 AM
              />
              <GanttMarker
                timeMs={1769487000000} // Tue Jan 27 — 4:10 AM
              />
              <GanttBracketOpen timeMs={1769487300000} />{' '}
              {/* Tue Jan 27 — 4:15 AM */}
              <GanttSpacer
                startTimeMs={1769487300000} // Tue Jan 27 — 4:15 AM
                endTimeMs={1769695200000} // Thu Jan 29 — 12:00 PM
                color='critical'
              />
              <GanttBracketClose timeMs={1769695200000} />{' '}
              {/* Thu Jan 29 — 12:00 PM */}
            </GanttRow>

            <GanttRow>
              {/* Row 2 elements */}
              <GanttBlock
                startTimeMs={1769491800000} // Tue Jan 27 — 5:30 AM
                endTimeMs={1769497200000} // Tue Jan 27 — 7:00 AM
                color='accent'
              />
              <GanttIconMarker
                timeMs={1769564000000} // Wed Jan 28 — 1:45 AM
                color='serious'
              >
                <Icon size='small'>
                  <Placeholder />
                </Icon>
              </GanttIconMarker>
              <GanttBlock
                startTimeMs={1769643000000} // Wed Jan 28 — 11:30 PM
                endTimeMs={1769653800000} // Thu Jan 29 — 2:30 AM
                color='serious'
              >
                <div className='flex flex-col text-body-xs'>
                  <span>MISSION ENTRY</span>
                  <span>11:30PM-02:30AM</span>
                </div>
              </GanttBlock>
            </GanttRow>
          </GanttContentContainer>
        </Gantt>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};
