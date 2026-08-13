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

import type {
  GanttTimescale as _GanttTimescale,
  GanttThreshold as _GanttThreshold,
  GanttMetThresholdData as _GanttMetThresholdData,
  GanttThresholdProps as _GanttThresholdProps,
  GanttRowElementColorProp as _GanttRowElementColorProp,
} from './types';
import type { GanttProviderProps as _GanttProviderProps } from './context';

/**
 * Public type exports for the Gantt component.
 *
 * NOTE: These types are for EXTERNAL consumption only.
 * Internal gantt files should import directly from './types'.
 */
export type GanttTimescale = _GanttTimescale;
export type GanttThreshold = _GanttThreshold;
export type GanttMetThresholdData = _GanttMetThresholdData;
export type GanttThresholdProps = _GanttThresholdProps;
export type GanttRowElementColorProp = _GanttRowElementColorProp;
export type GanttProviderProps = _GanttProviderProps;
