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

import 'server-only';
import { Badge } from '@accelint/design-toolkit/components/badge/index';
import { BentoItem } from '~/components/bento';
import type { BadgeProps } from '@accelint/design-toolkit/components/badge/types';

const PROP_COMBOS: BadgeProps[] = [
  { variant: 'advisory' },
  { variant: 'critical' },
  { variant: 'info' },
  { variant: 'normal' },
  { variant: 'serious' },
  { variant: 'advisory', children: '99+' },
  { variant: 'critical', children: '99+' },
  { variant: 'info', children: '99+' },
  { variant: 'normal', children: '99+' },
  { variant: 'serious', children: '99+' },
];

function PropCombos() {
  return PROP_COMBOS.map((props, k) => {
    return (
      <BentoItem key={k}>
        <Badge {...props} />
      </BentoItem>
    );
  });
}

export function BadgeExampleServer() {
  return (
    <>
      <PropCombos />
    </>
  );
}
