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

/**
 * Map Controls Module
 *
 * Provides event-driven control over map pan and zoom behaviors.
 *
 * ## Current Implementation
 *
 * Uses a simple event-based approach where components emit enable/disable events
 * directly. This works well for single-consumer use cases.
 *
 * ## Future Enhancement: Holder Pattern
 *
 * TODO: Consider implementing a "holder set" pattern similar to map-mode for
 * multi-consumer coordination. This would prevent race conditions when multiple
 * components need to control pan/zoom:
 *
 * Current (simple, potential race conditions):
 *   Component A emits disablePan => pan disabled
 *   Component B emits enablePan => pan enabled (A still thinks it's disabled!)
 *
 * Future (holder pattern, coordinated):
 *   Component A: requestDisablePan('drawing-tool') => pan disabled
 *   Component B: requestDisablePan('selection-tool') => still disabled
 *   Component A: releasePan('drawing-tool') => still disabled (B holds)
 *   Component B: releasePan('selection-tool') => pan enabled (no holders)
 *
 * The holder pattern would require:
 * - A store tracking Set<holderId> for each control (pan, zoom)
 * - Control is disabled when set.size > 0, enabled when set.size === 0
 * - useMapControls hook exposing requestDisable/release functions
 * - isPanEnabled/isZoomEnabled derived state
 */

export { MapControls } from './map-controls';
