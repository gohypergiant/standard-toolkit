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

'use client';
import 'client-only';
import { getLogger } from '@accelint/logger';
import { ErrorBoundary } from 'react-error-boundary';
import type { ErrorInfo, PropsWithChildren } from 'react';

const logger = getLogger({
  enabled: process.env.NODE_ENV !== 'production',
  level: 'error',
  prefix: '[Accordion]',
  pretty: true,
});

function onError(err: Error, info: ErrorInfo) {
  logger
    .withContext({ componentStack: info.componentStack })
    .withError(err)
    .error('Error boundary caught error');
}

function Fallback() {
  return <div>Error</div>;
}

export function ErrorComponent(props: PropsWithChildren) {
  const { children } = props;

  return (
    <ErrorBoundary fallback={<Fallback />} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}
