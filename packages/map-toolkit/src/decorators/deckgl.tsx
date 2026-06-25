// __private-exports

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

import { uuid } from '@accelint/core';
import { BaseMap } from '../deckgl/base-map';
import { DEFAULT_VIEW_STATE } from '../shared/constants';
import type { Decorator } from '@storybook/react-vite';
import type { MapViewportPayload } from '../deckgl/base-map/types';

// Module-level constant - stable across all Storybook renders
const STORYBOOK_MAP_ID = uuid();

/**
 * Options for the withDeckGL decorator.
 */
export type WithDeckGLOptions = {
  /**
   * Initial zoom level for the map.
   * @default 4
   */
  viewState?: Partial<MapViewportPayload>;
};

/**
 * Storybook decorator that wraps stories with a BaseMap component.
 *
 * Provides a full-screen map instance with a stable ID across re-renders,
 * allowing stories to test map-related components in a realistic context.
 *
 * **Warning:** This decorator uses a shared `STORYBOOK_MAP_ID` across all stories.
 * It is only suitable for visual-only stories (rendering layers without interactivity).
 * Stories that use per-map interactivity (e.g. `useMapMode`, cursor state,
 * `onClick`/`onHover` handlers) must render their own `<BaseMap>` with a dedicated
 * `uuid()`. Using the shared ID with per-map state causes stale state after
 * zoom/pan because bus events reference different map instances.
 *
 * @returns Storybook decorator function that wraps the story in a BaseMap
 *
 * @example
 * Visual-only story (no interactivity):
 * ```tsx
 * import type { Meta, StoryObj } from '@storybook/react';
 * import { withDeckGL } from '@accelint/map-toolkit/decorators/deckgl';
 * import { MyMapComponent } from './MyMapComponent';
 *
 * const meta: Meta<typeof MyMapComponent> = {
 *   component: MyMapComponent,
 *   decorators: [withDeckGL()],
 * };
 *
 * export default meta;
 * type Story = StoryObj<typeof MyMapComponent>;
 *
 * export const Default: Story = {};
 * ```
 *
 * @example
 * Interactive story (needs dedicated BaseMap):
 * ```tsx
 * import { uuid } from '@accelint/core';
 * import { BaseMap } from '@accelint/map-toolkit/deckgl';
 *
 * const MY_MAP_ID = uuid();
 *
 * // Do NOT use withDeckGL() — render your own BaseMap instead
 * export const Interactive: Story = {
 *   render: () => {
 *     const [selected, setSelected] = useState<Set<EntityId>>(() => new Set());
 *     return (
 *       <BaseMap id={MY_MAP_ID} onClick={handleClick}>
 *         <myLayer selectedEntityIds={selected} />
 *       </BaseMap>
 *     );
 *   },
 * };
 * ```
 */
export const withDeckGL = ({
  viewState,
}: WithDeckGLOptions = {}): Decorator => {
  return (Story) => {
    return (
      <BaseMap
        className='h-dvh w-dvw'
        id={STORYBOOK_MAP_ID}
        initialViewState={{ ...DEFAULT_VIEW_STATE, ...viewState }}
      >
        <Story />
      </BaseMap>
    );
  };
};
