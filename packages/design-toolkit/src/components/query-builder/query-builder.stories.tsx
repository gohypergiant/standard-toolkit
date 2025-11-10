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
import { QueryBuilder } from './';
import { defaultQuery, fields } from './__fixtures__/example-configuration';
import type { Meta, StoryObj } from '@storybook/react';
import type { RuleGroupType } from './types';

/**
 * A custom port of the React QueryBuilder component: https://react-querybuilder.js.org/
 */
const meta = {
  title: 'Components/QueryBuilder',
  component: QueryBuilder,
  args: {
    orientation: 'horizontal',
    disabled: false,
    showCloneButtons: false,
    showLockButtons: false,
    showRuleLines: true,
  },
  argTypes: {
    orientation: { options: ['horizontal', 'vertical'] },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    controls: {
      include: [
        'disabled',
        'orientation',
        'showCloneButtons',
        'showLockButtons',
        'showRuleLines',
      ],
    },
    docs: {
      subtitle: 'Builds a complex formatted query for filtering a dataset',
    },
  },
} satisfies Meta<typeof QueryBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [query, setQuery] = useState<RuleGroupType>(defaultQuery);

    return (
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={setQuery}
        {...args}
      />
    );
  },
};
