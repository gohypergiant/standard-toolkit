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

import { Clock } from '@accelint/design-toolkit/components/clock';
import { afterAll, beforeAll, vi } from 'vitest';
import { createVisualTestScenarios } from '~/visual-regression/vitest';

const CUSTOM_FORMATTER = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'short',
  timeStyle: 'long',
  timeZone: 'UTC',
  hour12: false,
});

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-15T12:30:45.000Z'));
});

afterAll(() => {
  vi.useRealTimers();
});

createVisualTestScenarios('Clock', [
  {
    name: 'default',
    render: () => <Clock />,
    screenshotName: 'clock-default.png',
    className: 'inline-block p-l',
  },
  {
    name: 'custom format',
    render: () => <Clock formatter={CUSTOM_FORMATTER} />,
    screenshotName: 'clock-custom-format.png',
    className: 'inline-block p-l',
  },
  {
    name: 'styled',
    render: () => <Clock className='fg-accent-primary-bold' />,
    screenshotName: 'clock-styled.png',
    className: 'inline-block p-l',
  },
]);
