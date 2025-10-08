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

import { useState } from 'react';
import { Pagination } from '.';
import type { Meta, StoryObj } from '@storybook/react';
import type { BasePaginationProps } from './types';

type Alias = React.FC<BasePaginationProps>;

const meta = {
  title: 'Components/Pagination',
  component: Pagination as Alias,
  args: {
    currentPage: 1,
    pageCount: 4,
  },
} satisfies Meta<Alias>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: ({ children, ...args }) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage);

    return (
      <Pagination.Provider value={{ currentPage, pageCount: args.pageCount }}>
        <Pagination>
          <Pagination.Previous
            onPress={() => setCurrentPage(currentPage! - 1)}
          />
          <Pagination.NumberContainer
            onPress={(pageNumber) => setCurrentPage(pageNumber)}
          />
          <Pagination.Next onPress={() => setCurrentPage(currentPage! + 1)} />
        </Pagination>
      </Pagination.Provider>
    );
  },
};
