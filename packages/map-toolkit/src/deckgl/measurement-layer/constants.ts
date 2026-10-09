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
 * Map mode the measurement store claims for the duration of a drag, so a
 * measurement cannot start over a shape that is being drawn or edited and
 * those tools cannot start while a measurement is in progress.
 *
 * @see {@link https://github.com/gohypergiant/standard-toolkit/tree/main/packages/map-toolkit/src/map-mode | map-mode}
 */
export const MEASUREMENT_MODE = 'measure';

/**
 * Owner identifier the measurement store registers with the map mode system.
 */
export const MEASUREMENT_LAYER_ID = 'measurement-layer';
