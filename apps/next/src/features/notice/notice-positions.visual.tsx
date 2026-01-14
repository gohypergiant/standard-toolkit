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

import { useEmit } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { NoticeList } from '@accelint/design-toolkit';
import { NoticeEventTypes } from '@accelint/design-toolkit/components/notice/events';
import type { NoticeQueueEvent } from '@accelint/design-toolkit/components/notice/types';
import { useEffect, useMemo } from 'react';
import { createVisualTestScenarios } from '~/visual-regression/vitest';

const PLACEMENTS = [
  'top left',
  'top',
  'top right',
  'left',
  'right',
  'bottom left',
  'bottom',
  'bottom right',
] as const;

const SIZES = ['small', 'medium'] as const;

type Placement = (typeof PLACEMENTS)[number];
type Size = (typeof SIZES)[number];

function NoticePositionVariant({
  placement,
  size,
}: {
  placement: Placement;
  size: Size;
}) {
  const listId = useMemo(() => uuid(), []);
  const emit = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);

  useEffect(() => {
    emit({
      target: listId,
      message: 'This is a notice message',
      color: 'info',
    });
  }, [emit, listId]);

  return (
    <div className='relative h-screen w-screen bg-surface-muted'>
      <NoticeList
        id={listId}
        placement={placement}
        size={size}
        hideClearAll
        aria-label={`${placement} ${size} notices`}
      />
    </div>
  );
}

createVisualTestScenarios(
  'Notice Positions',
  PLACEMENTS.flatMap((placement) =>
    SIZES.map((size) => ({
      name: `${placement} position ${size}`,
      render: () => <NoticePositionVariant placement={placement} size={size} />,
      screenshotName: `notice-position-${placement.replace(' ', '-')}-${size}.png`,
      waitMs: 300,
    })),
  ),
);
