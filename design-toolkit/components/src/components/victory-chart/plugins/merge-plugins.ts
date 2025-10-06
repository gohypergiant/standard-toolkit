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

import { factoryForDetail } from './factories/detail';
import { factoryForFocus } from './factories/focus';
import { factoryForNoData } from './factories/no-data';
import { factoryForRulerDay } from './factories/ruler-day';
import { factoryForRulerHour } from './factories/ruler-hour';
import { factoryForTiming } from './factories/timing';
import { factoryForTitle } from './factories/title';
import { factoryForZoom } from './factories/zoom';
import type { Plugins, PluginsInitial } from '.';

export function mergePlugins(overrides: PluginsInitial = {}): Plugins {
  return {
    title: factoryForTitle(overrides),
    noData: factoryForNoData(overrides),
    detail: factoryForDetail(overrides),
    focus: factoryForFocus(overrides),
    rulerDay: factoryForRulerDay(overrides),
    rulerHour: factoryForRulerHour(overrides),
    timing: factoryForTiming(overrides),
    zoom: factoryForZoom(overrides),
  };
}
