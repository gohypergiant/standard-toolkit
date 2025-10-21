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

import { Broadcast } from '@accelint/bus';
import { _WidgetImpl, type WidgetImplProps } from '@deck.gl/widgets';
import { MapEvents } from '@/deckgl/base-map/events';
import type {
  _GlobeViewport,
  Viewport,
  WebMercatorViewport,
} from '@deck.gl/core';
import type { MapEventType } from '@/deckgl/base-map/types';

export const bus = Broadcast.getInstance<MapEventType>();

export type ViewportSyncWidgetProps = WidgetImplProps;

/**
 * NOTE: a lot of the custom widget support is undocumented / not released fully. This is more of a
 * proof of concept for how we can accomplish a task and solve a problem.
 */

export class ViewportSyncWidget extends _WidgetImpl<ViewportSyncWidgetProps> {
  static override defaultProps: Required<ViewportSyncWidgetProps> = {
    ..._WidgetImpl.defaultProps,
    id: 'viewport-sync',
  };

  className = 'deck-widget-viewport-sync';

  constructor(
    props: ViewportSyncWidgetProps = ViewportSyncWidget.defaultProps,
  ) {
    // @ts-expect-error issue with deckgl types
    super(props);
  }

  override setProps(props: Partial<ViewportSyncWidgetProps>): void {
    super.setProps(props);
  }

  // biome-ignore lint/suspicious/noEmptyBlockStatements: intentionally void
  handleClick(): void {}

  // biome-ignore lint/suspicious/noEmptyBlockStatements: intentionally void
  onRenderHTML(): void {}

  onViewportChange(viewport: Viewport): void {
    if (!viewport.isGeospatial) {
      return;
    }

    const { latitude, longitude, zoom } = viewport as
      | WebMercatorViewport
      | _GlobeViewport;

    // NOTE: can probably add more to this in the future, stubbing some common ones for now
    bus.emit(MapEvents.viewport, {
      id: this.props.id,
      latitude,
      longitude,
      zoom,
      bounds: viewport.getBounds(),
    });
  }
}
