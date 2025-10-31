// __private-exports

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

import { uuid } from '@accelint/core';
import { BaseMap } from '../deckgl/base-map';
import type { Decorator } from '@storybook/react';

// Module-level constant - stable across all Storybook renders
const STORYBOOK_MAP_ID = uuid();

export const withDeckGL = (): Decorator => {
  return (Story) => {
    return (
      <BaseMap className='h-dvh w-dvw' id={STORYBOOK_MAP_ID}>
        <Story />
      </BaseMap>
    );
  };
};
