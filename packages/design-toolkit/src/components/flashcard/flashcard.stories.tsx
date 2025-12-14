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

import { uuid } from '@accelint/core';
import { Fragment } from 'react/jsx-runtime';
import {
  Flashcard,
  FlashcardAdditionalData,
  FlashcardDetailsLabel,
  FlashcardDetailsList,
  FlashcardDetailsValue,
  FlashcardHero,
} from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const DEFAULT_DETAILS = [
  { label: 'key', value: 'value-1', id: uuid() },
  { label: 'key', value: 'value-2', id: uuid() },
  { label: 'key', value: 'value-3', id: uuid() },
  { label: 'key', value: 'value-4', id: uuid() },
  { label: 'key', value: 'value-5', id: uuid() },
  { label: 'key', value: 'value-6', id: uuid() },
  { label: 'key', value: 'value-7', id: uuid() },
];

const meta = {
  title: 'Components/Flashcard',
  component: Flashcard,
  args: {
    isLoading: false,
    header: 'IDENTIFIER',
    subheader: 'DATA',
  },
} satisfies Meta<typeof Flashcard>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: (args) => {
    return (
      <Flashcard {...args}>
        <FlashcardHero />
        <FlashcardAdditionalData>SECONDARY_DATA_01</FlashcardAdditionalData>
        <FlashcardAdditionalData>SECONDARY_DATA_02</FlashcardAdditionalData>
        <FlashcardDetailsList data-testid='secondary'>
          {DEFAULT_DETAILS.map((detail) => (
            <Fragment key={detail.id}>
              <FlashcardDetailsLabel>{detail.label}</FlashcardDetailsLabel>
              <FlashcardDetailsValue>{detail.value}</FlashcardDetailsValue>
            </Fragment>
          ))}
        </FlashcardDetailsList>
      </Flashcard>
    );
  },
};
