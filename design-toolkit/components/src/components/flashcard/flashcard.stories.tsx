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

import {
  Flashcard,
  FlashcardDetailsContainer,
  FlashcardHeader,
  FlashcardHero,
  FlashcardIdentifier,
  FlashcardSecondaryContainer,
  FlashcardSecondaryData,
  FlashcardSubheader,
} from '.';
import type { Meta, StoryObj } from '@storybook/react';

const DEFAULT_DETAILS = [
  { label: 'key', value: 'value' },
  { label: 'key', value: 'value' },
  { label: 'key', value: 'value' },
  { label: 'key', value: 'value' },
  { label: 'key', value: 'value' },
  { label: 'key', value: 'value' },
  { label: 'key', value: 'value' },
];

const meta = {
  title: 'Components/Flashcard',
  component: Flashcard,
  args: {
    isLoading: false,
  },
} satisfies Meta<typeof Flashcard>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: ({ children, ...args }) => {
    return (
      <Flashcard {...args}>
        <FlashcardHero>
          <FlashcardIdentifier>
            <FlashcardHeader>IDENTIFIER</FlashcardHeader>
            <FlashcardSubheader>DATA</FlashcardSubheader>
          </FlashcardIdentifier>
        </FlashcardHero>
        <FlashcardSecondaryContainer>
          <FlashcardSecondaryData>SECONDARY_DATA_01</FlashcardSecondaryData>
          <FlashcardDetailsContainer details={DEFAULT_DETAILS} />
        </FlashcardSecondaryContainer>
      </Flashcard>
    );
  },
};
