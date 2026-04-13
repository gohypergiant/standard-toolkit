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

import type { UniqueId } from '@accelint/core';

/**
 * Tracks which map instance is currently active (last hovered).
 * Used to gate keyboard shortcuts (e.g. Shift for RBZ) to the correct map
 * in multi-instance layouts. Read/written imperatively — no React subscription needed.
 */
let activeMapId: UniqueId | null = null;

export function setActiveMap(id: UniqueId): void {
  activeMapId = id;
}

export function isActiveMap(id: UniqueId): boolean {
  return activeMapId === id;
}
