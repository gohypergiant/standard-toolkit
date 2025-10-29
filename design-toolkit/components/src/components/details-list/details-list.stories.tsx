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

import { DetailsList } from './';
import { DetailsListLabel } from './label';
import { DetailsListValue } from './value';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/DetailsList',
  component: DetailsList,
  args: {
    align: 'justify',
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['left', 'justify', 'center'],
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A semantic details list component for displaying metadata in key-value pairs. Perfect for map object details, user profiles, or any structured information displayed in sidebars or detail panels.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DetailsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DetailsList {...args}>
      <DetailsListLabel>Key</DetailsListLabel>
      <DetailsListValue>Value</DetailsListValue>

      <DetailsListLabel>Ships</DetailsListLabel>
      <DetailsListValue>Millennium Falcon</DetailsListValue>
      <DetailsListValue>USS Enterprise NCC-1701</DetailsListValue>
      <DetailsListValue>Serenity</DetailsListValue>

      <DetailsListLabel>Coordinates</DetailsListLabel>
      <DetailsListValue>
        <div>Great Pyramid of Giza: 29°58'44" N 31°08'02" E</div>
        <div>Machu Picchu: 13°09'47" S 72°32'41" W</div>
        <div>Nazca Lines: 14.7390° S, 75.1300° W</div>
        <div>Colosseum: 41°53'24" N 12°29'32" E</div>
        <div>Taj Mahal: 27°10'30" N 78°02'31" E</div>
      </DetailsListValue>
    </DetailsList>
  ),
};
