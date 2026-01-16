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

import { Notice } from '@accelint/design-toolkit/components/notice';
import type { NoticeColor } from '@accelint/design-toolkit/components/notice/types';
import { createVisualTestScenarios } from '~/visual-regression/vitest';
import { COLORS, VARIANTS_BY_COLOR } from './variants';

function NoticeColorVariants({ color }: { color: NoticeColor }) {
  const variants = VARIANTS_BY_COLOR[color];
  return (
    <div className='flex flex-col gap-m p-l'>
      {variants.map((props, k) => (
        <Notice key={k} message='This is a notice message' {...props} />
      ))}
    </div>
  );
}

createVisualTestScenarios(
  'Notice',
  COLORS.map((color) => ({
    name: `${color} variants`,
    render: () => <NoticeColorVariants color={color} />,
    screenshotName: `notice-${color}.png`,
  })),
);
