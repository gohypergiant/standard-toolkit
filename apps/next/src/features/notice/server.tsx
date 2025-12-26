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
import { Notice } from '@accelint/design-toolkit/components/notice';
import { MEDIUM_VARIANTS, SMALL_VARIANTS } from './variants';

export function NoticeExampleServer() {
  return (
    <>
      <div className='flex flex-row flex-wrap gap-m'>
        {MEDIUM_VARIANTS.map((props, k) => (
          <Notice key={k} message='This is a notice message' {...props} />
        ))}
      </div>
      <div className='flex flex-row flex-wrap gap-m'>
        {SMALL_VARIANTS.map((props, k) => (
          <Notice key={k} message='This is a notice message' {...props} />
        ))}
      </div>
    </>
  );
}
