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

import { Placeholder } from '@/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { forwardRef, useContext } from 'react';
import {
  CollectionRendererContext,
  TreeContext,
  TreeStateContext,
  useContextProps,
} from 'react-aria-components';
import { IconButton } from '../icon-button';
import { Tooltip } from '../tooltip';
import { Tree } from './index';

const meta: Meta<typeof Tree> = {
  title: 'Components/Tree',
  component: Tree,
  args: {
    // className: undefined,
    size: 'cozy',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['cozy', 'compact'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tree>;

const ExampleAction = () => {
  return (
    <Tooltip delay={500}>
      <Tooltip.Trigger>
        <IconButton size='small'>
          <Placeholder />
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Body>Action Label</Tooltip.Body>
    </Tooltip>
  );
};

export const Default: Story = {
  render: (args) => (
    <Tree className='w-[450px]' {...args}>
      <Tree.Item label='Testing'>
        <Tree.Item label='Testing'>
          <Tree.Item
            label='Testing'
            actionComponent={<ExampleAction />}
            iconComponent={<Placeholder />}
          />
          <Tree.Item label='Testing'></Tree.Item>
          <Tree.Item label='Testing'></Tree.Item>
        </Tree.Item>
        <Tree.Item label='Testing' isDisabled={true}>
          <Tree.Item label='Testing'></Tree.Item>
          <Tree.Item label='Testing'></Tree.Item>
        </Tree.Item>
      </Tree.Item>
      <Tree.Item label='Testing'>
        <Tree.Item label='Testing'></Tree.Item>
        <Tree.Item label='Testing'></Tree.Item>
      </Tree.Item>
      <Tree.Item label='Testing'></Tree.Item>
      <Tree.Item isDisabled={true} label='Testing'></Tree.Item>
      <Tree.Item isDisabled={true} label='Testing'></Tree.Item>
      <Tree.Item label='Testing'></Tree.Item>
    </Tree>
  ),
};
