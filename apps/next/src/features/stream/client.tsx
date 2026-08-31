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
  Button,
  Chip,
  DetailsList,
  DetailsListLabel,
  DetailsListValue,
  StatusIndicator,
  Switch,
} from '@accelint/design-toolkit';
import { StreamClient } from '@accelint/stream';
import {
  StreamClientProvider,
  useSSEStream,
  useSSEStreams,
} from '@accelint/stream/react';
import { streamDevtoolsPlugin } from '@accelint/stream-devtools/react';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { useState } from 'react';
import type { StatusIndicatorProps } from '@accelint/design-toolkit';
import type { StreamObserverResult, StreamStatus } from '@accelint/stream';
import type { UseSSEStreamsConfig } from '@accelint/stream/react';

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

type DatasetId = 'tracks' | 'ships' | 'vehicles';

const DATASETS: { id: DatasetId; label: string }[] = [
  { id: 'tracks', label: 'Tracks' },
  { id: 'ships', label: 'Ships' },
  { id: 'vehicles', label: 'Vehicles' },
];

const MERGED_FEED_CAP = 20;

type DemoEntity = {
  id: string;
  callsign: string;
  /** [lon, lat], GeoJSON order. */
  coordinates: [number, number];
  speedKts: number;
  headingDeg: number;
};

type DemoEvent = {
  name: string;
  entities: DemoEntity[];
};

/** One SSE frame from /stream/events - can carry several events. */
type DemoEventFrame = {
  datasetId: DatasetId;
  events: DemoEvent[];
};

type EventRow = {
  key: string;
  firedAt: number;
  datasetId: DatasetId;
  name: string;
  entities: DemoEntity[];
};

type MergedFeed = {
  rows: EventRow[];
  statuses: { id: DatasetId; status: StreamStatus; messageCount: number }[];
};

/** Index of the stream whose cursor points at the newest frame. */
function newestSource(
  results: readonly StreamObserverResult<DemoEventFrame, DemoEventFrame>[],
  cursors: readonly number[],
): number {
  let best = -1;
  let bestAt = -1;

  for (let i = 0; i < results.length; i += 1) {
    const cursor = cursors[i] ?? -1;

    if (cursor < 0) {
      // this buffer is exhausted
      continue;
    }

    const at = results[i]?.messages[cursor]?.dataUpdatedAt ?? 0;

    if (at > bestAt) {
      best = i;
      bestAt = at;
    }
  }

  return best;
}

/**
 * K-way merge over the per-stream ring buffers: walk each buffer
 * newest-first and exit at the display cap - O(cap x streams). Ordered by
 * dataUpdatedAt; sequence is per-stream and not comparable across streams.
 */
function mergeEvents(
  results: readonly StreamObserverResult<DemoEventFrame, DemoEventFrame>[],
  cap: number,
): EventRow[] {
  // one cursor per stream, starting at the newest frame (buffers are
  // chronological by construction, so newest = last index)
  const cursors = results.map((result) => result.messages.length - 1);
  const rows: EventRow[] = [];

  while (rows.length < cap) {
    // pick the stream whose head frame is newest
    const pick = newestSource(results, cursors);

    if (pick === -1) {
      // every buffer is exhausted
      break;
    }

    const cursor = cursors[pick] ?? 0;
    const message = results[pick]?.messages[cursor];
    cursors[pick] = cursor - 1;

    // one frame can carry several events
    message?.data.events.forEach((event, index) => {
      rows.push({
        key: `${message.data.datasetId}:${message.sequence}:${index}`,
        firedAt: message.dataUpdatedAt,
        datasetId: message.data.datasetId,
        name: event.name,
        entities: event.entities, // by reference, never copied
      });
    });
  }

  // a multi-event frame can overshoot the cap by a few rows
  return rows.length > cap ? rows.slice(0, cap) : rows;
}

function formatFiredAt(at: number): string {
  const iso = new Date(at).toISOString();
  return `${iso.slice(0, 10)} - ${iso.slice(11, 19)} Z`;
}

function formatCoordinates([lon, lat]: [number, number]): string {
  return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
}

function EventRowItem(props: {
  row: EventRow;
  isExpanded: boolean;
  onExpandedChange: (isExpanded: boolean) => void;
}) {
  const { isExpanded, onExpandedChange, row } = props;
  const dataset = DATASETS.find((entry) => entry.id === row.datasetId);
  const entityCount = row.entities.length;

  return (
    <li className='border-b border-b-static-light last:border-b-0'>
      <Accordion
        isExpanded={isExpanded}
        onExpandedChange={onExpandedChange}
        variant='compact'
      >
        <AccordionHeader className='flex items-center gap-m'>
          <AccordionTrigger>
            <span className='flex items-center gap-m'>
              <Chip size='small'>{dataset?.label.toUpperCase()}</Chip>
              <span className='flex flex-col items-start'>
                <span className='fg-primary-bold uppercase'>{row.name}</span>
                <span className='fg-primary-muted font-mono text-body-s'>
                  {formatFiredAt(row.firedAt)}
                </span>
              </span>
            </span>
          </AccordionTrigger>
          <Chip size='small'>
            {entityCount} {entityCount === 1 ? 'entity' : 'entities'}
          </Chip>
        </AccordionHeader>
        <AccordionPanel>
          <div className='flex flex-col gap-m'>
            {row.entities.map((entity) => (
              <div className='flex flex-col gap-xs' key={entity.id}>
                <h3 className='fg-primary-bold'>{entity.callsign}</h3>
                <DetailsList align='left'>
                  <DetailsListLabel>Callsign</DetailsListLabel>
                  <DetailsListValue>{entity.callsign}</DetailsListValue>

                  <DetailsListLabel>Coordinates</DetailsListLabel>
                  <DetailsListValue>
                    {formatCoordinates(entity.coordinates)}
                  </DetailsListValue>

                  <DetailsListLabel>Speed</DetailsListLabel>
                  <DetailsListValue>{entity.speedKts} kts</DetailsListValue>

                  <DetailsListLabel>Heading</DetailsListLabel>
                  <DetailsListValue>
                    {String(entity.headingDeg).padStart(3, '0')}°
                  </DetailsListValue>

                  <DetailsListLabel>Source</DetailsListLabel>
                  <DetailsListValue>
                    {dataset?.label.toUpperCase()}
                  </DetailsListValue>
                </DetailsList>
              </div>
            ))}
          </div>
        </AccordionPanel>
      </Accordion>
    </li>
  );
}

/**
 * One useSSEStreams call over a runtime-variable set of dataset streams -
 * the component-per-stream TickCards above it can't express this shape,
 * since hook count per render is fixed. Toggling a dataset off releases
 * its subscription (gc linger); survivors keep their buffers.
 */
/** Rows that arrived since the feed was pinned. */
function countPendingRows(
  liveRows: EventRow[],
  pinnedRows: EventRow[],
): number {
  const pinnedKeys = new Set(pinnedRows.map((row) => row.key));

  return liveRows.filter((row) => !pinnedKeys.has(row.key)).length;
}

function MergedFeedCard() {
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<string>>(
    () => new Set(),
  );
  // freeze-on-expand: while any row is open, the rendered rows are pinned
  // to this snapshot, so the row being read can't shift or fall off the
  // cap. The streams keep running underneath - statuses and counts stay
  // live, and the pinned rows stay renderable because message buffers are
  // immutable snapshots.
  const [pinnedRows, setPinnedRows] = useState<EventRow[] | null>(null);
  const [selected, setSelected] = useState<DatasetId[]>([
    'tracks',
    'ships',
    'vehicles',
  ]);

  const feed = useSSEStreams(
    selected.map(
      (id): UseSSEStreamsConfig<DemoEventFrame> => ({
        streamKey: ['events', id],
        uri: `/stream/events?dataset=${id}`,
        messageHistory: MESSAGE_HISTORY,
      }),
    ),
    {
      combine: (results): MergedFeed => ({
        rows: mergeEvents(results, MERGED_FEED_CAP),
        statuses: selected.map((id, index) => ({
          id,
          status: results[index]?.status ?? 'connecting',
          // newest sequence = total frames received, unlike messages.length
          // which plateaus at the messageHistory cap
          messageCount: results[index]?.messages.at(-1)?.sequence ?? 0,
        })),
      }),
    },
  );

  const rows = pinnedRows ?? feed.rows;
  const pendingCount = pinnedRows ? countPendingRows(feed.rows, pinnedRows) : 0;

  function handleExpandedRowChange(rowKey: string, isExpanded: boolean) {
    const next = new Set(expandedRowKeys);

    if (isExpanded) {
      next.add(rowKey);
    } else {
      next.delete(rowKey);
    }

    setExpandedRowKeys(next);
    setPinnedRows(next.size > 0 ? (pinnedRows ?? feed.rows) : null);
  }

  function resumeFeed() {
    setExpandedRowKeys(new Set());
    setPinnedRows(null);
  }

  return (
    <div className='flex flex-col gap-m rounded-md bg-surface-default p-l'>
      <div className='flex items-center justify-between'>
        <h2 className='fg-primary-bold'>
          Merged event feed (one useSSEStreams call, {selected.length} streams)
        </h2>
        <div className='flex items-center gap-l'>
          {DATASETS.map((dataset) => (
            <Switch
              isSelected={selected.includes(dataset.id)}
              key={dataset.id}
              onChange={(isSelected) => {
                setSelected((prev) =>
                  isSelected
                    ? DATASETS.map((entry) => entry.id).filter(
                        (id) => id === dataset.id || prev.includes(id),
                      )
                    : prev.filter((id) => id !== dataset.id),
                );
              }}
            >
              {dataset.label}
            </Switch>
          ))}
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-l'>
          {feed.statuses.map((entry) => (
            <div className='flex items-center gap-xs' key={entry.id}>
              <StatusIndicator
                status={INDICATOR_STATUS[entry.status]}
                textValue={entry.status}
              />
              <span className='fg-primary-muted text-body-s'>
                {entry.id} ({entry.messageCount})
              </span>
            </div>
          ))}
        </div>
        {pinnedRows && (
          <Button
            color='accent'
            onPress={resumeFeed}
            size='xsmall'
            variant='outline'
          >
            {pendingCount > 0
              ? `Feed paused - show ${pendingCount} new ${pendingCount === 1 ? 'event' : 'events'}`
              : 'Feed paused - resume'}
          </Button>
        )}
      </div>
      {rows.length === 0 ? (
        <p className='fg-primary-muted'>
          {selected.length === 0
            ? 'Toggle a dataset on to start the feed.'
            : 'Waiting for events...'}
        </p>
      ) : (
        <ol className='flex max-h-200 flex-col overflow-y-auto'>
          {rows.map((row) => (
            <EventRowItem
              isExpanded={expandedRowKeys.has(row.key)}
              key={row.key}
              onExpandedChange={(isExpanded) => {
                handleExpandedRowChange(row.key, isExpanded);
              }}
              row={row}
            />
          ))}
        </ol>
      )}
    </div>
  );
}

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
            listed with live message logs and lifecycle timelines. The merged
            event feed at the bottom observes one stream per dataset through a
            single useSSEStreams call - toggle datasets on and off to grow and
            shrink the set at runtime. All feed data is randomly generated:
            callsigns, positions, and events are synthetic.
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
        <MergedFeedCard />
      </div>
      <TanStackDevtools plugins={DEVTOOLS_PLUGINS} />
    </StreamClientProvider>
  );
}
