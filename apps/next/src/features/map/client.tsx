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
import { uuid } from '@accelint/core';
import { BaseMap } from '@accelint/map-toolkit/deckgl';
import { DEFAULT_VIEW_STATE } from '@accelint/map-toolkit/shared/constants';
import { MapTestBridge } from './test-bridge';
import type { ReactNode } from 'react';
import { clsx } from '@accelint/design-foundation/lib/utils';

export type MapClientProps = {
  children?: ReactNode;
  className?: string;
};

const mapId = uuid();

export function MapClient({
  children,
  className,
}: MapClientProps) {

  return (
    <>
      <BaseMap
        className={clsx(className, 'fixed top-xxl left-0 right-0 bottom-0')}
        id={mapId}
        initialViewState={DEFAULT_VIEW_STATE}
      >
        {children}
      </BaseMap>
      <MapTestBridge />
    </>
  );
}
