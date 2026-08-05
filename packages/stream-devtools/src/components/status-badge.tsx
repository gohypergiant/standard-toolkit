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

import { Tag } from '@tanstack/devtools-ui';
import { STATUS_TAG_COLORS } from './tokens';
import type { StreamStatus } from '@accelint/stream';

/**
 * Color-coded stream status badge — devtools-ui `Tag` with the
 * query-devtools hue mapping. Detail-pane only; the header renders the
 * faithful query-devtools `StatusChip` pill (panel.tsx) instead.
 */
export function StatusBadge(props: { status: StreamStatus }) {
  return <Tag color={STATUS_TAG_COLORS[props.status]} label={props.status} />;
}
