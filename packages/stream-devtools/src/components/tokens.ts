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

import { STREAM_STATUS } from '@accelint/stream';
import type { StreamStatus } from '@accelint/stream';

/**
 * Residual palette values lifted from the @tanstack/query-devtools theme.
 * Everything else comes from @tanstack/devtools-ui components — these are
 * only the slots with no devtools-ui equivalent (custom list rows, tooltip
 * bubble, inject textarea, inline notes).
 */
export const PALETTE = {
  /** gray[300] — default panel text. */
  text: '#d0d5dd',
  /** gray[500] — muted labels, timestamps, hints. */
  muted: '#667085',
  /** darkGray[400] — pane dividers. */
  border: '#313749',
  /** darkGray[600] — row separators + selected-row background. */
  surface: '#212530',
  /** darkGray[800] — inject textarea background. */
  inputBg: '#111318',
  /** darkGray[300] — inject textarea border. */
  inputBorder: '#394056',
  /** darkGray[500] — tooltip bubble background. */
  tooltipBg: '#292e3d',
  /** gray[600] — tooltip bubble border. */
  tooltipBorder: '#475467',
  /** yellow[400] — duplicate badge + destructive note. */
  warning: '#FDB022',
  /** red[400] — inline error text. */
  error: '#f87171',
  /** darkGray[500] — header status-chip pill background. */
  chipBg: '#292e3d',
  /** darkGray[400] at ~80% alpha — collapsed-chip hover (query-devtools). */
  chipHoverBg: '#313749cc',
  /** darkGray[300] — chip count box at zero (neutral). */
  countNeutralBg: '#394056',
  /** gray[400] — chip count text at zero (neutral). */
  countNeutralText: '#98a2b3',
} as const;

/**
 * query-devtools hue semantics: connected≈fresh (green), connecting≈fetching
 * (blue), error (red), disconnected≈inactive (gray). Solid badge/chip fills
 * use the 600 step.
 */
export const STATUS_BASE_COLORS: Record<StreamStatus, string> = {
  [STREAM_STATUS.CONNECTED]: '#039855',
  [STREAM_STATUS.CONNECTING]: '#1570EF',
  [STREAM_STATUS.ERROR]: '#dc2626',
  [STREAM_STATUS.DISCONNECTED]: '#475467',
};

/**
 * Header status-chip colors (query-devtools `queryStatusTag` recipe):
 * `dot` = chip indicator (500 step), `countBg`/`countText` = the 900/300
 * pairing the count box takes when the count is live. Disconnected has no
 * pairing — its count box stays neutral at any count.
 */
export const STATUS_CHIP_COLORS: Record<
  StreamStatus,
  { dot: string; countBg?: string; countText?: string }
> = {
  [STREAM_STATUS.CONNECTED]: {
    dot: '#12B76A',
    countBg: '#054F31',
    countText: '#6CE9A6',
  },
  [STREAM_STATUS.CONNECTING]: {
    dot: '#2E90FA',
    countBg: '#194185',
    countText: '#84CAFF',
  },
  [STREAM_STATUS.ERROR]: {
    dot: '#ef4444',
    countBg: '#7f1d1d',
    countText: '#fca5a5',
  },
  [STREAM_STATUS.DISCONNECTED]: {
    dot: '#98a2b3',
  },
};

/** Same hue mapping expressed as devtools-ui `Tag` color names. */
export const STATUS_TAG_COLORS: Record<
  StreamStatus,
  'blue' | 'gray' | 'green' | 'red'
> = {
  [STREAM_STATUS.CONNECTED]: 'green',
  [STREAM_STATUS.CONNECTING]: 'blue',
  [STREAM_STATUS.ERROR]: 'red',
  [STREAM_STATUS.DISCONNECTED]: 'gray',
};

/** Chrome text/labels — the devtools shell's sans stack. */
export const FONT_SANS =
  'ui-sans-serif, Inter, system-ui, sans-serif, sans-serif';

/** Stream hashes, timestamps, payloads. */
export const FONT_MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

/**
 * From @tanstack/query-devtools constants.ts. Measured against the PANEL
 * root, not the window. Below `second` the list/detail columns stack and
 * chip labels hide; below `first` labels also hide while a detail pane is
 * open.
 */
export const BREAKPOINTS = {
  first: 1024,
  second: 796,
} as const;

/** hh:mm:ss.mmm — millisecond precision matters when debugging SSE bursts. */
export function formatTime(timestamp: number): string {
  const time = new Date(timestamp);
  const millis = String(time.getMilliseconds()).padStart(3, '0');
  return `${time.toLocaleTimeString(undefined, { hour12: false })}.${millis}`;
}
