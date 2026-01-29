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
import { Table } from '../table';
import { TableBody } from '../table/body';
import { TableCell } from '../table/cell';
import { TableHeader } from '../table/header';
import { TableHeaderCell } from '../table/header-cell';
import { TableRow } from '../table/row';
import { Tooltip } from '../tooltip';
import { TooltipTrigger } from '../tooltip/trigger';
import { StatusIndicator } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/StatusIndicator/Composition',
  tags: ['!autodocs'],
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof StatusIndicator>;

export const WithLabel: Story = {
  render: () => (
    <div className='flex items-center gap-s'>
      <StatusIndicator status='good' />
      <Label>System online</Label>
    </div>
  ),
};

export const WithTooltip: Story = {
  render: () => {
    return (
      <div className='p-m'>
        <TooltipTrigger>
          <StatusIndicator status='degraded' />
          <Tooltip>System unstable. Double check connection.</Tooltip>
        </TooltipTrigger>
      </div>
    );
  },
};

type RadarSite = {
  id: string;
  siteName: string;
  status: 'good' | 'degraded' | 'poor';
  lastUpdated: string;
};

const defaultData: RadarSite[] = [
  {
    id: 'site-001',
    siteName: 'North Ridge Station',
    status: 'good',
    lastUpdated: '2026-01-27T00:00:00Z',
  },
  {
    id: 'site-002',
    siteName: 'Coastal Watchpoint',
    status: 'degraded',
    lastUpdated: '2026-01-27T00:00:00Z',
  },
  {
    id: 'site-003',
    siteName: 'High Desert Array',
    status: 'good',
    lastUpdated: '2026-01-27T00:00:00Z',
  },
  {
    id: 'site-004',
    siteName: 'Arctic Relay Node',
    status: 'poor',
    lastUpdated: '2026-01-27T00:00:00Z',
  },
  {
    id: 'site-005',
    siteName: 'Southern Valley Outpost',
    status: 'degraded',
    lastUpdated: '2026-01-27T00:00:00Z',
  },
];

export const InTable: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Site Name</TableHeaderCell>
          <TableHeaderCell>Last Updated</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {defaultData.map((site) => (
          <TableRow key={site.id}>
            <TableCell>
              <StatusIndicator status={site.status} />
            </TableCell>
            <TableCell>{site.siteName}</TableCell>
            <TableCell>{site.lastUpdated}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
