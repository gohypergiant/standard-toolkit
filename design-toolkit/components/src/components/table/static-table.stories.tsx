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

import { TableBody } from './body';
import { TableCell } from './cell';
import { TableHeader } from './header';
import { TableHeaderCell } from './header-cell';
import { Table } from './index';
import { TableRow } from './row';
import type { Meta, StoryObj } from '@storybook/react';

type Person = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultData: Person[] = [
  {
    id: 'tanner',
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    id: 'tandy',
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    id: 'joe',
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
];

const meta = {
  title: 'Components/Table',
  component: Table,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {
  render: (...args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>First Name</TableHeaderCell>
          <TableHeaderCell>Last Name</TableHeaderCell>
          <TableHeaderCell>Age</TableHeaderCell>
          <TableHeaderCell>Visits</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Progress</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {defaultData.map((person) => (
          <TableRow key={person.id}>
            <TableCell>{person.firstName}</TableCell>
            <TableCell>{person.lastName}</TableCell>
            <TableCell>{person.age}</TableCell>
            <TableCell>{person.visits}</TableCell>
            <TableCell>{person.status}</TableCell>
            <TableCell>{person.progress}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
