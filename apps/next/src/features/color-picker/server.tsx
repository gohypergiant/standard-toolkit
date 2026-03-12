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

import 'server-only';
import { ColorPicker } from '@accelint/design-toolkit/components/color-picker';
import { BentoItem } from '~/components/bento';
import { PROP_COMBOS } from './variants';

export function ColorPickerExampleServer() {
  return (
    <>
      {PROP_COMBOS.map(({ name, props }) => (
        <BentoItem key={name}>
          <ColorPicker {...props} />
        </BentoItem>
      ))}
      <BentoItem>
        <p className='text-body-sm mb-xs'>
          Tight fit — focus outlines should not be clipped:
        </p>
        <div className='overflow-hidden inline-block'>
          <ColorPicker items={PROP_COMBOS[0].props.items} />
        </div>
      </BentoItem>
    </>
  );
}
