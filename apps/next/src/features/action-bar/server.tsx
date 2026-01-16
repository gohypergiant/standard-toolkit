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
import { ActionBar } from '@accelint/design-toolkit/components/action-bar';
import { Button } from '@accelint/design-toolkit/components/button';
import { Icon } from '@accelint/design-toolkit/components/icon';
import PlaceholderIcon from '@accelint/icons/placeholder';
import { BentoItem } from '~/components/bento';
import { PROP_COMBOS } from './variants';

function PropCombos() {
  return PROP_COMBOS.map((props) => {
    return (
      <BentoItem key={props.size}>
        <ActionBar {...props}>
          <Button>
            <Icon>
              <PlaceholderIcon />
            </Icon>
          </Button>
          <Button>
            <Icon>
              <PlaceholderIcon />
            </Icon>
          </Button>
          <Button>
            <Icon>
              <PlaceholderIcon />
            </Icon>
          </Button>
        </ActionBar>
      </BentoItem>
    );
  });
}

export function ActionBarExampleServer() {
  return (
    <>
      <PropCombos />
    </>
  );
}
