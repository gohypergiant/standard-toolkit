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

import { useViewportState } from './store';
import { getViewportSize } from './utils';
import type { UniqueId } from '@accelint/core';
import type { ComponentPropsWithRef } from 'react';
import type { SupportedDistanceUnit } from './types';

export type ViewportSizeProps = ComponentPropsWithRef<'span'> & {
  instanceId: UniqueId;
  unit?: SupportedDistanceUnit;
};

/**
 * A span element displaying the current viewport bounds in the specified unit.
 *
 * Displays the viewport dimensions in a format like `660 x 1,801 NM`.
 * Updates automatically as the viewport changes by subscribing to viewport events.
 *
 * @param props - Extends `<span>` props
 * @param props.instanceId - The id of the view to subscribe to
 * @param props.unit - Measure of distance: `km | m | nm | mi | ft`. Defaults to `nm`
 * @param props.className - CSS classes for styling
 *
 * @example
 * ```tsx
 * // Basic usage with default nautical miles
 * <ViewportSize instanceId="some-uuid" />
 *
 * // With custom unit and styling
 * <ViewportSize
 *   instanceId="some-uuid"
 *   unit="km"
 *   className="text-sm text-gray-600"
 * />
 * ```
 */
export function ViewportSize({
  instanceId,
  unit = 'nm',
  ...rest
}: ViewportSizeProps) {
  const { bounds, zoom, width, height } = useViewportState(instanceId);

  return (
    <span {...rest}>
      {getViewportSize({ bounds, unit, zoom, width, height })}
    </span>
  );
}
