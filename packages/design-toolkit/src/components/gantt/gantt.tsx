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

import { GanttProvider } from './context';

/**
 * Main Gantt component for timeline visualization.
 *
 * Uses a composition pattern where `Gantt` wraps a panel container
 * (fixed-width row labels) alongside a content container (scrollable
 * timeline with virtualized rows).
 *
 * @example
 * ```tsx
 * <Gantt
 *   startTimeMs={startMs}
 *   endTimeMs={endMs}
 *   timescale="1h"
 *   currentTimeMs={Date.now()}
 * >
 *   <GanttPanelContainer>
 *     {rows.map((row) => (
 *       <GanttPanelRow key={row.id}>{row.name}</GanttPanelRow>
 *     ))}
 *   </GanttPanelContainer>
 *   <GanttContentContainer>
 *     {rows.map((row) => (
 *       <GanttContentRow key={row.id}>
 *         <GanttBlock startTimeMs={row.startMs} endTimeMs={row.endMs} />
 *       </GanttContentRow>
 *     ))}
 *   </GanttContentContainer>
 * </Gantt>
 * ```
 */
export const Gantt = GanttProvider;
