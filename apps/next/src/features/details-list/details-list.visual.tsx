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

import { DetailsList } from '@accelint/design-toolkit/components/details-list';
import { DetailsListLabel } from '@accelint/design-toolkit/components/details-list/label';
import { DetailsListValue } from '@accelint/design-toolkit/components/details-list/value';
import { createVisualTestScenarios } from '~/visual-regression/vitest';
import type { DetailsListProps } from '@accelint/design-toolkit/components/details-list/types';

const ALIGNMENTS: DetailsListProps['align'][] = ['justify', 'left', 'center'];

createVisualTestScenarios(
  'DetailsList',
  ALIGNMENTS.map((align) => ({
    name: `align ${align}`,
    render: () => (
      <DetailsList align={align}>
        <DetailsListLabel>Key</DetailsListLabel>
        <DetailsListValue>Value</DetailsListValue>

        <DetailsListLabel>Ships</DetailsListLabel>
        <DetailsListValue>Millennium Falcon</DetailsListValue>
        <DetailsListValue>USS Enterprise NCC-1701</DetailsListValue>
        <DetailsListValue>Serenity</DetailsListValue>

        <DetailsListLabel>Coordinates</DetailsListLabel>
        <DetailsListValue>
          <div>Great Pyramid of Giza: 29°58'44" N 31°08'02" E</div>
          <div>Machu Picchu: 13°09'47" S 72°32'41" W</div>
          <div>Nazca Lines: 14.7390° S, 75.1300° W</div>
          <div>Colosseum: 41°53'24" N 12°29'32" E</div>
          <div>Taj Mahal: 27°10'30" N 78°02'31" E</div>
        </DetailsListValue>
      </DetailsList>
    ),
    screenshotName: `details-list-${align}.png`,
    className: 'p-s',
  })),
);
