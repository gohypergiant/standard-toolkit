/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { getLogger } from '@accelint/logger';
import { openTelemetryPlugin } from '@loglayer/plugin-opentelemetry';
import { HttpTransport } from '@loglayer/transport-http';

const isServer = typeof window === 'undefined';

export const logger = getLogger({
  enabled: true,
  level: 'trace',
  prefix: '[@apps/next]',
  pretty: true,
  transports: [
    new HttpTransport({
      enabled: !isServer,
      url: '/api/otel',
      method: 'POST',
      enableBatchSend: false,
      payloadTemplate: ({ logLevel, message, data }) =>
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: logLevel,
          message,
          metadata: data,
        }),
    }),
  ],
  plugins: [
    openTelemetryPlugin({
      traceFieldName: 'trace',
      traceIdFieldName: 'traceId',
      spanIdFieldName: 'spanId',
      traceFlagsFieldName: 'flags',
    }),
  ],
});

const comment = {
  postId: 1,
  id: 3,
  name: 'odio adipisci rerum aut animi',
  email: 'foo@bar.biz',
  body: 'quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\nomnis quibusdam delectus saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione',
};

export function testLogs() {
  const logWithContext = logger.withMetadata({ comment });
  logWithContext.info('Info test...');
  logWithContext.debug('Debug test...');
  // These are a bit noisy
  // logWithContext.warn('Warning test...');
  // logWithContext.trace('Trace test...');
  // logWithContext.withError(new Error('Error Test!')).error('Error test...');
  // logWithContext.fatal('Fatal test...');
}
