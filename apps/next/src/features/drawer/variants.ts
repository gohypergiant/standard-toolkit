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

export type DrawerVariant = {
  placement: 'left' | 'right' | 'top' | 'bottom';
  menuPosition: 'start' | 'center' | 'end';
};

export const PROP_COMBOS: DrawerVariant[] = [
  // Left placement
  { placement: 'left', menuPosition: 'start' },
  { placement: 'left', menuPosition: 'center' },
  { placement: 'left', menuPosition: 'end' },
  // Right placement
  { placement: 'right', menuPosition: 'start' },
  { placement: 'right', menuPosition: 'center' },
  { placement: 'right', menuPosition: 'end' },
  // Top placement
  { placement: 'top', menuPosition: 'start' },
  { placement: 'top', menuPosition: 'center' },
  { placement: 'top', menuPosition: 'end' },
  // Bottom placement
  { placement: 'bottom', menuPosition: 'start' },
  { placement: 'bottom', menuPosition: 'center' },
  { placement: 'bottom', menuPosition: 'end' },
];
