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

import { Range } from '../range';
import type React from 'react';
import type { ChartState } from '../../lib/chart-state';
import type { PluginsInitial } from '..';

interface FocusProps {
  onUpdate: (state: Partial<ChartState>) => void;
  state: ChartState;
}

const timeWindows = [
  ['2 hours', 2],
  ['4 hours', 4],
  ['8 hours', 8],
  ['12 hours', 12],
  ['24 hours', 24],
  ['2 days', 2 * 24],
  ['4 days', 4 * 24],
  ['6 days', 6 * 24],
  // ...Array.from(
  //   { length: 13 },
  //   (_, index) => [`${index + 2} days`, 24 * (index + 2)] as const,
  // ),
] as const;

const defaultValue = 4;
const [defaultLabel, defaultHours] = timeWindows[defaultValue];

/**
 * Because `<input type="range />` can only make use of a constant `step`
 * property, this component uses the indexes of the array as the value rather
 * than the text or number values of the elements of the array. The "useful"
 * value is the numeric (hours) and will be provided externally; while the
 * "helpful" value - for the user - is the string describing what the value is.
 * These values allow for simple "lookup".
 */
const [valueToIndex, valueToLabel] = Object.values(timeWindows).reduce(
  ([valueToIndex, valueToLabel], [label, value], index) => {
    valueToLabel.set(value, label);
    valueToIndex.set(value, index);

    return [valueToIndex, valueToLabel];
  },
  [new Map<number, number>(), new Map<number, string>()],
);

export function factoryForFocus({ focus }: PluginsInitial) {
  if (focus === false) {
    return false;
  }

  if (!focus) {
    return (({ onUpdate, state }: FocusProps) => (
      <Range
        altText={'How much time will be shown in the timeline.'}
        label={'Focus'}
        max={timeWindows.length - 1}
        min={0}
        onUpdate={(e) => {
          const [_, focus] = timeWindows[Number.parseFloat(e.target.value)] ?? [
            defaultLabel,
            defaultHours,
          ];

          onUpdate({ focus });
        }}
        preview={valueToLabel.get(state.focus) ?? defaultLabel}
        step={1}
        value={valueToIndex.get(state.focus) ?? defaultValue}
      />
    )) as React.FC;
  }

  return focus;
}
