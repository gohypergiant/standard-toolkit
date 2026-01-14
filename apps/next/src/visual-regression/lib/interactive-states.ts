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

import type { InteractiveState } from './types';

/**
 * States that require user interaction to trigger (hover, focus, pressed).
 * Used to skip these states for disabled components.
 */
export const INTERACTION_STATES: InteractiveState[] = [
  'hover',
  'focus',
  'pressed',
];

/**
 * Default states to test when not specified.
 * Includes all interactive states in recommended test order.
 */
export const DEFAULT_TEST_STATES: InteractiveState[] = [
  'default',
  'hover',
  'focus',
  'pressed',
  'disabled',
];
