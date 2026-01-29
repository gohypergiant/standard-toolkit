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

import { Label } from 'react-aria-components';
import { StatusIndicator } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { StatusIndicatorProps } from './types';

const meta = {
  title: 'Components/StatusIndicator',
  component: StatusIndicator,
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof StatusIndicator>;

const STATUSES: StatusIndicatorProps['status'][] = [
  'good',
  'degraded',
  'poor',
] as const;

export const Default: Story = {
  render: () => (
    <div className='flex gap-xl'>
      {STATUSES.map((status) => (
        <div
          key={status}
          className='flex flex-col items-center justify-center gap-s'
        >
          <StatusIndicator status={status} />
          <Label className='capitalize'>{status}</Label>
        </div>
      ))}
    </div>
  ),
};
