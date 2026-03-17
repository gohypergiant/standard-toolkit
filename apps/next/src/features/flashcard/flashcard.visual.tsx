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

import {
  Flashcard,
  FlashcardAdditionalData,
  FlashcardDetailsLabel,
  FlashcardDetailsList,
  FlashcardDetailsValue,
  FlashcardHero,
} from '@accelint/design-toolkit/components/flashcard';
import { createVisualTestScenarios } from '~/visual-regression/vitest';

function FlashcardContent() {
  return (
    <>
      <FlashcardHero />
      <FlashcardAdditionalData>SECONDARY_DATA_01</FlashcardAdditionalData>
      <FlashcardAdditionalData>SECONDARY_DATA_02</FlashcardAdditionalData>
      <FlashcardDetailsList>
        <FlashcardDetailsLabel>key</FlashcardDetailsLabel>
        <FlashcardDetailsValue>value-1</FlashcardDetailsValue>
        <FlashcardDetailsLabel>key</FlashcardDetailsLabel>
        <FlashcardDetailsValue>value-2</FlashcardDetailsValue>
        <FlashcardDetailsLabel>key</FlashcardDetailsLabel>
        <FlashcardDetailsValue>value-3</FlashcardDetailsValue>
        <FlashcardDetailsLabel>key</FlashcardDetailsLabel>
        <FlashcardDetailsValue>value-4</FlashcardDetailsValue>
        <FlashcardDetailsLabel>key</FlashcardDetailsLabel>
        <FlashcardDetailsValue>value-5</FlashcardDetailsValue>
      </FlashcardDetailsList>
    </>
  );
}

createVisualTestScenarios('Flashcard', [
  {
    name: 'default',
    render: () => (
      <Flashcard header='IDENTIFIER' subheader='DATA'>
        <FlashcardContent />
      </Flashcard>
    ),
    screenshotName: 'flashcard-default.png',
    className: 'inline-block p-s',
  },
  {
    name: 'loading',
    render: () => (
      <Flashcard isLoading header='IDENTIFIER' subheader='DATA'>
        <FlashcardContent />
      </Flashcard>
    ),
    screenshotName: 'flashcard-loading.png',
    className: 'inline-block p-s',
  },
]);
