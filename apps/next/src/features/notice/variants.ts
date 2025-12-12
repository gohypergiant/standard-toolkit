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

import { uuid } from '@accelint/core';
import type { NoticeProps } from '@accelint/design-toolkit/components/notice/types';

export type NoticeVariant = Pick<NoticeProps, 'color' | 'size' | 'id'>;

export const PROP_COMBOS: NoticeVariant[] = [
  { color: 'info', size: 'medium', id: uuid() },
  { color: 'advisory', size: 'medium', id: uuid() },
  { color: 'normal', size: 'medium', id: uuid() },
  { color: 'serious', size: 'medium', id: uuid() },
  { color: 'critical', size: 'medium', id: uuid() },
  { color: 'info', size: 'small', id: uuid() },
  { color: 'critical', size: 'small', id: uuid() },
];
