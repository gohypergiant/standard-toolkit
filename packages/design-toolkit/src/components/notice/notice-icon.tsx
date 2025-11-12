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

'use client';

import 'client-only';
import { Information, Problem, Success, Warning } from '@accelint/icons';
import { Icon } from '../icon';
import type { NoticeIconProps } from './types';

export function NoticeIcon({ color = 'info', size }: NoticeIconProps) {
  return (
    <Icon size={size === 'small' ? 'medium' : 'large'}>
      {color === 'info' && <Information />}
      {color === 'advisory' && <Information />}
      {color === 'normal' && <Success />}
      {color === 'serious' && <Warning />}
      {color === 'critical' && <Problem />}
    </Icon>
  );
}
