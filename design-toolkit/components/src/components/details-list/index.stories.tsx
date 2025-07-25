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

import type { Meta, StoryObj } from '@storybook/react';
import { DetailsList } from './index';

const meta: Meta<typeof DetailsList> = {
  title: 'Components/DetailsList',
  component: DetailsList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A semantic details list component for displaying metadata in key-value pairs. Perfect for map object details, user profiles, or any structured information displayed in sidebars or detail panels.',
      },
    },
  },
  argTypes: {
    spacing: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Spacing between grid items',
    },
    justifyLabel: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Horizontal alignment of labels',
    },
    justifyValue: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Horizontal alignment of values',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DetailsList>;

export const Default: Story = {
  args: {
    spacing: 'medium',
    justifyLabel: 'left',
    justifyValue: 'left',
  },
  render: (args) => (
    <DetailsList {...args}>
      <DetailsList.Label>Key</DetailsList.Label>
      <DetailsList.Value>Value</DetailsList.Value>

      <DetailsList.Label>Ships</DetailsList.Label>
      <DetailsList.Value>Millennium Falcon</DetailsList.Value>
      <DetailsList.Value>USS Enterprise NCC-1701</DetailsList.Value>
      <DetailsList.Value>Serenity</DetailsList.Value>

      <DetailsList.Label>Coordinates</DetailsList.Label>
      <DetailsList.Value>
        <div>Great Pyramid of Giza: 29°58'44" N 31°08'02" E</div>
        <div>Machu Picchu: 13°09'47" S 72°32'41" W</div>
        <div>Nazca Lines: 14.7390° S, 75.1300° W</div>
        <div>Colosseum: 41°53'24" N 12°29'32" E</div>
        <div>Taj Mahal: 27°10'30" N 78°02'31" E</div>
      </DetailsList.Value>
    </DetailsList>
  ),
};
