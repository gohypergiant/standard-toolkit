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
import { Avatar } from '@accelint/design-toolkit/components/avatar';
import { Badge } from '@accelint/design-toolkit/components/badge';
import { Icon } from '@accelint/design-toolkit/components/icon';
import PlaceholderIcon from '@accelint/icons/placeholder';
import { BentoItem } from '~/components/bento';
import { PROP_COMBOS } from './variants';

function PropCombos() {
  return PROP_COMBOS.map((variant, k) => {
    const { hasBadge, hasLabel, hasFallback, ...props } = variant;

    return (
      <BentoItem key={k}>
        <Avatar
          {...props}
          fallbackProps={
            hasFallback
              ? {
                  children: (
                    <Icon>
                      <PlaceholderIcon />
                    </Icon>
                  ),
                }
              : undefined
          }
        >
          {hasBadge && <Badge color='critical'>99+</Badge>}
          {hasLabel && <div>DOG</div>}
        </Avatar>
      </BentoItem>
    );
  });
}

export function AvatarExampleServer() {
  return (
    <>
      <PropCombos />
    </>
  );
}
