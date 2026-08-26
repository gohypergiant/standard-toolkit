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

'use client';
import 'client-only';

import {
  Accordion,
  AccordionHeader,
  AccordionPanel,
  AccordionTrigger,
  DetailsList,
  DetailsListLabel,
  DetailsListValue,
  StatusIndicator,
} from '@accelint/design-toolkit';
import { StreamClient } from '@accelint/stream';
import { StreamClientProvider, useSSEStream } from '@accelint/stream/react';
import { streamDevtoolsPlugin } from '@accelint/stream-devtools/react';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { useState } from 'react';
import type { StatusIndicatorProps } from '@accelint/design-toolkit';
import type { StreamStatus } from '@accelint/stream';

type DemoTick = {
  tick: number;
  at: string;
  intervalMs: number;
};

const INDICATOR_STATUS: Record<
  StreamStatus,
  NonNullable<StatusIndicatorProps['status']>
> = {
  connected: 'good',
  connecting: 'pending',
  error: 'poor',
  disconnected: 'unknown',
};

const MESSAGE_HISTORY = 50;

function TickCard(props: { label: string; streamId: string; uri: string }) {
  const { data, status, messages } = useSSEStream<DemoTick>({
    streamKey: ['devtools-demo', props.streamId],
    uri: props.uri,
    messageHistory: MESSAGE_HISTORY,
  });

  return (
    <div className='flex flex-col gap-m rounded-md bg-surface-default p-l'>
      <div className='flex items-center justify-between'>
        <h2 className='fg-primary-bold'>{props.label}</h2>
        <StatusIndicator status={INDICATOR_STATUS[status]} textValue={status} />
      </div>
      <DetailsList align='left'>
        <DetailsListLabel>Tick</DetailsListLabel>
        <DetailsListValue>{data?.tick ?? '-'}</DetailsListValue>

        <DetailsListLabel>Last update</DetailsListLabel>
        <DetailsListValue>{data?.at ?? '-'}</DetailsListValue>

        <DetailsListLabel>Interval</DetailsListLabel>
        <DetailsListValue>
          {data ? `${data.intervalMs} ms` : '-'}
        </DetailsListValue>
      </DetailsList>
      <Accordion variant='compact'>
        <AccordionHeader>
          <AccordionTrigger>
            Messages ({messages.length}
            {messages.length === MESSAGE_HISTORY ? ', rolling' : ''})
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          <ol className='flex max-h-200 flex-col gap-xs overflow-y-auto font-mono text-body-s'>
            {/* retained oldest-first; show newest at the top */}
            {[...messages].reverse().map((message) => (
              <li className='flex justify-between gap-m' key={message.sequence}>
                <span className='fg-primary-bold'>
                  tick {message.data.tick}
                </span>
                <span className='fg-primary-muted'>
                  {new Date(message.dataUpdatedAt).toISOString().slice(11, 23)}
                </span>
              </li>
            ))}
          </ol>
        </AccordionPanel>
      </Accordion>
    </div>
  );
}

// zero-config: the panel resolves the client from StreamClientProvider
const DEVTOOLS_PLUGINS = [streamDevtoolsPlugin];

export function StreamExampleClient() {
  // one client per page lifetime
  const [client] = useState(() => new StreamClient());

  return (
    <StreamClientProvider client={client}>
      <div className='flex flex-col gap-l bg-surface-muted p-xl'>
        <div className='flex flex-col gap-s'>
          <h1 className='fg-primary-bold text-header-l'>
            Stream devtools demo
          </h1>
          <p className='fg-primary-muted'>
            Three SSE streams tick below. Open the TanStack Devtools trigger
            (bottom corner) and pick the Streams tab - all three should be
            listed with live message logs and lifecycle timelines.
          </p>
        </div>
        <div className='grid grid-cols-3 gap-l'>
          <TickCard
            label='Extra fast ticker (250ms)'
            streamId='xfast'
            uri='/stream/sse?speed=xfast'
          />
          <TickCard
            label='Fast ticker (1s)'
            streamId='fast'
            uri='/stream/sse?speed=fast'
          />
          <TickCard
            label='Slow ticker (3s)'
            streamId='slow'
            uri='/stream/sse?speed=slow'
          />
        </div>
      </div>
      <TanStackDevtools plugins={DEVTOOLS_PLUGINS} />
    </StreamClientProvider>
  );
}
