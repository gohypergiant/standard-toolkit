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

/**
 * Demo SSE source for the merged event feed: each frame carries one or
 * more events, each with an entity list, mimicking a rules-engine
 * activation stream. Reading the request URL makes the handler dynamic;
 * segment config is rejected under `cacheComponents`.
 */

type DatasetId = 'tracks' | 'ships' | 'vehicles';

type DatasetConfig = {
  intervalMs: number;
  callsigns: string[];
  eventNames: string[];
  /** [lon, lat] center the fleet drifts around. */
  origin: [number, number];
  speedRangeKts: [number, number];
};

// Everything below is deliberately synthetic: phonetic-alphabet callsigns
// (no real registrations, flight numbers, or vessel names) and origins in
// open ocean near Null Island (0, 0) - not real-world locations.
const DATASETS: Record<DatasetId, DatasetConfig> = {
  tracks: {
    intervalMs: 1000,
    callsigns: [
      'TRK-ALPHA',
      'TRK-BRAVO',
      'TRK-CHARLIE',
      'TRK-DELTA',
      'TRK-ECHO',
      'TRK-FOXTROT',
    ],
    eventNames: [
      'LOW ALTITUDE',
      'TRANSPONDER ALERT',
      'ENTERED AOI ALPHA',
      'ROUTE DEVIATION',
    ],
    origin: [2.0, 1.5],
    speedRangeKts: [250, 500],
  },
  ships: {
    intervalMs: 2500,
    callsigns: [
      'SHP-ALPHA',
      'SHP-BRAVO',
      'SHP-CHARLIE',
      'SHP-DELTA',
      'SHP-ECHO',
      'SHP-FOXTROT',
    ],
    eventNames: [
      'ENTERED PORT ZONE',
      'AIS SIGNAL GAP',
      'SPEED ANOMALY',
      'RENDEZVOUS DETECTED',
    ],
    origin: [-3.0, -1.0],
    speedRangeKts: [8, 24],
  },
  vehicles: {
    intervalMs: 4000,
    callsigns: [
      'VEH-ALPHA',
      'VEH-BRAVO',
      'VEH-CHARLIE',
      'VEH-DELTA',
      'VEH-ECHO',
    ],
    eventNames: [
      'GEOFENCE EXIT',
      'CONVOY SPLIT',
      'SPEED THRESHOLD',
      'STOPPED ON ROUTE',
    ],
    origin: [0.5, 3.0],
    speedRangeKts: [10, 65],
  },
};

const DEFAULT_DATASET: DatasetId = 'tracks';

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickOne<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)] as T;
}

function buildEntity(config: DatasetConfig, callsign: string) {
  const [lon, lat] = config.origin;
  const [minKts, maxKts] = config.speedRangeKts;

  return {
    id: callsign,
    callsign,
    // [lon, lat], GeoJSON order - the fleet drifts around the origin
    coordinates: [
      Number((lon + randomBetween(-1.5, 1.5)).toFixed(4)),
      Number((lat + randomBetween(-1.5, 1.5)).toFixed(4)),
    ] as [number, number],
    speedKts: Math.round(randomBetween(minKts, maxKts)),
    headingDeg: Math.round(randomBetween(0, 359)),
  };
}

function buildEvent(config: DatasetConfig) {
  // mostly single-entity events, occasionally a cluster
  const entityCount = Math.random() < 0.7 ? 1 : Math.random() < 0.7 ? 2 : 3;
  const pool = [...config.callsigns].sort(() => Math.random() - 0.5);

  return {
    name: pickOne(config.eventNames),
    entities: pool
      .slice(0, entityCount)
      .map((callsign) => buildEntity(config, callsign)),
  };
}

function buildFrame(datasetId: DatasetId, config: DatasetConfig) {
  // one frame can carry several events
  const eventCount = Math.random() < 0.8 ? 1 : 2;

  return {
    datasetId,
    events: Array.from({ length: eventCount }, () => buildEvent(config)),
  };
}

export function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get('dataset') ?? '';
  // hasOwn: bare indexing resolves keys like 'constructor' through the prototype
  const datasetId: DatasetId = Object.hasOwn(DATASETS, requested)
    ? (requested as DatasetId)
    : DEFAULT_DATASET;
  const config = DATASETS[datasetId];

  const encoder = new TextEncoder();
  let timer: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      timer = setInterval(() => {
        const payload = JSON.stringify(buildFrame(datasetId, config));
        try {
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch {
          // consumer went away between abort and this tick
          clearInterval(timer);
        }
      }, config.intervalMs);

      request.signal.addEventListener('abort', () => {
        clearInterval(timer);
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
    cancel() {
      clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    },
  });
}
