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

export { BaseMap, type BaseMapProps } from './base-map';
export {
  BASE_MAP_STYLE,
  PARAMETERS,
} from './base-map/constants';
export { MapEvents, MapEventsNamespace } from './base-map/events';
export {
  MapModeContext,
  type MapModeContextValue,
  MapModeProvider,
  type MapModeProviderProps,
} from './base-map/map-mode-provider';
export {
  MapModeEvents,
  MapModeEventsNamespace,
} from './base-map/map-mode-provider/events';
export { useMapMode } from './base-map/map-mode-provider/use-map-mode';
export { SymbolLayer, type SymbolLayerProps } from './symbol-layer';
export type {
  MapModeEventType,
  ModeChangeAuthorizationEvent,
  ModeChangeAuthorizationPayload,
  ModeChangeDecisionEvent,
  ModeChangeDecisionPayload,
  ModeChangedEvent,
  ModeChangedPayload,
  ModeChangeRequestEvent,
  ModeChangeRequestPayload,
} from './base-map/map-mode-provider/types';
export type {
  MapClickEvent,
  MapClickPayload,
  MapEventType,
  MapHoverEvent,
  MapHoverPayload,
} from './base-map/types';
