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
 * Demo SSE source for the stream example. Reading the request URL
 * makes the handler dynamic; segment config is rejected under
 * `cacheComponents`.
 */

const MIN_INTERVAL_MS = 250;
const DEFAULT_INTERVAL_MS = 1000;

export function GET(request: Request) {
  const requested = Number(
    new URL(request.url).searchParams.get('interval') ?? DEFAULT_INTERVAL_MS,
  );
  const interval = Number.isFinite(requested)
    ? Math.max(MIN_INTERVAL_MS, requested)
    : DEFAULT_INTERVAL_MS;

  const encoder = new TextEncoder();
  let timer: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      let tick = 0;

      timer = setInterval(() => {
        tick += 1;
        const payload = JSON.stringify({
          tick,
          at: new Date().toISOString(),
          intervalMs: interval,
        });
        try {
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch {
          // consumer went away between abort and this tick
          clearInterval(timer);
        }
      }, interval);

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
