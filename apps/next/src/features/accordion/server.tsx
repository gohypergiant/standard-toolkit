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
import { AccordionHeader } from '@accelint/design-toolkit/components/accordion/header';
import { Accordion } from '@accelint/design-toolkit/components/accordion/index';
import { AccordionPanel } from '@accelint/design-toolkit/components/accordion/panel';
import { AccordionTrigger } from '@accelint/design-toolkit/components/accordion/trigger';
import { Button } from '@accelint/design-toolkit/components/button/index';
import { Icon } from '@accelint/design-toolkit/components/icon/index';
import { Menu } from '@accelint/design-toolkit/components/menu/index';
import { MenuItem } from '@accelint/design-toolkit/components/menu/item';
import { MenuTrigger } from '@accelint/design-toolkit/components/menu/trigger';
import PlaceholderIcon from '@accelint/icons/placeholder';
import { BentoItem } from '~/components/bento';
import { PROP_COMBOS } from './variants';

function PropCombos() {
  return PROP_COMBOS.map((props, k) => {
    return (
      <BentoItem key={k}>
        <Accordion {...props}>
          <AccordionHeader>
            <AccordionTrigger>
              <Icon>
                <PlaceholderIcon />
              </Icon>
              Title
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <p>Details</p>
          </AccordionPanel>
        </Accordion>
      </BentoItem>
    );
  });
}

function MenuExample() {
  return (
    <BentoItem>
      <Accordion variant='cozy' isExpanded>
        <AccordionHeader>
          <AccordionTrigger>
            <Icon>
              <PlaceholderIcon />
            </Icon>
            Title
          </AccordionTrigger>
          <MenuTrigger>
            <Button />
            <Menu>
              <MenuItem>Foo</MenuItem>
              <MenuItem>Bar</MenuItem>
            </Menu>
          </MenuTrigger>
        </AccordionHeader>
        <AccordionPanel>
          <p>Details</p>
        </AccordionPanel>
      </Accordion>
    </BentoItem>
  );
}

export function AccordionExampleServer() {
  return (
    <>
      <PropCombos />
      <MenuExample />
    </>
  );
}
