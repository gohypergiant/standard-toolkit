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
import { AccordionGroup } from '@accelint/design-toolkit/components/accordion/group';
import { AccordionHeader } from '@accelint/design-toolkit/components/accordion/header';
import { Accordion } from '@accelint/design-toolkit/components/accordion/index';
import { AccordionPanel } from '@accelint/design-toolkit/components/accordion/panel';
import { AccordionTrigger } from '@accelint/design-toolkit/components/accordion/trigger';
import { Icon } from '@accelint/design-toolkit/components/icon/index';
import PlaceholderIcon from '@accelint/icons/placeholder';
import { BentoItem } from '~/components/bento';
import type { AccordionGroupProps } from '@accelint/design-toolkit/components/accordion/types';

const PROP_COMBOS: AccordionGroupProps[] = [
  { variant: 'cozy' },
  { variant: 'compact' },
  { variant: 'cozy', isDisabled: true },
  { variant: 'compact', isDisabled: true },
  {
    variant: 'cozy',
    allowsMultipleExpanded: true,
    defaultExpandedKeys: ['a', 'b'],
  },
  {
    variant: 'compact',
    allowsMultipleExpanded: false,
    defaultExpandedKeys: ['a', 'b'],
  },
];

function PropExamples() {
  return PROP_COMBOS.map((props, k) => {
    return (
      <BentoItem key={k}>
        <AccordionGroup {...props}>
          {/** biome-ignore lint/correctness/useUniqueElementIds: temp id */}
          <Accordion id='a'>
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
          {/** biome-ignore lint/correctness/useUniqueElementIds: temp id */}
          <Accordion id='b'>
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
        </AccordionGroup>
      </BentoItem>
    );
  });
}

export function AccordionGroupExampleServer() {
  return (
    <>
      <PropExamples />
    </>
  );
}
