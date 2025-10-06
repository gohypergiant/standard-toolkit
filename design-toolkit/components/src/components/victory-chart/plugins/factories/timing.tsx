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

import { getTimeString } from '../../lib/date-utils';
import type { ChartItem } from '../../data';
import type { PluginsInitial } from '..';

export function factoryForTiming({ timing }: PluginsInitial) {
  return (
    timing ||
    (({ item }: { item: ChartItem }) => (
      <span
        className='relative flex h-full w-full cursor-help items-center justify-center rounded-full bg-accent-primary-bold text-center hover:bg-accent-primary-hover'
        title={`${getTimeString(item.start)} - ${getTimeString(item.end)}`}
      />
    ))
  );
}
