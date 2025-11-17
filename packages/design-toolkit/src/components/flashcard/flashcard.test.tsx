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
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Flashcard,
  FlashcardDetailsContainer,
  FlashcardHeader,
  FlashcardHero,
  FlashcardIdentifier,
  FlashcardSecondary,
  FlashcardSecondaryData,
  FlashcardSubheader,
} from '.';

function setup(isLoading = false) {
  const details = [
    { label: 'OBJECTID', value: 75, id: uuid() },
    { label: 'NAME', value: 'Acrisure Stadium', id: uuid() },
    { label: 'LATITUDE', value: '40-26-48.22N', id: uuid() },
    { label: 'LONGITUDE', value: '080-00-56.66W', id: uuid() },
    { label: 'CITY', value: 'Pittsburgh', id: uuid() },
    { label: 'STATE', value: 'PA', id: uuid() },
    { label: 'STATUS_CODE', value: 'Open', id: uuid() },
    { label: 'OPENING_ON', value: null, id: uuid() },
  ];

  render(
    <Flashcard isLoading={isLoading}>
      <FlashcardHero>
        <FlashcardIdentifier>
          <FlashcardHeader>IDENTIFIER</FlashcardHeader>
          <FlashcardSubheader>DATA</FlashcardSubheader>
        </FlashcardIdentifier>
      </FlashcardHero>
      <FlashcardSecondary>
        <FlashcardSecondaryData>SECONDARY_DATA_01</FlashcardSecondaryData>
        <FlashcardSecondaryData>SECONDARY_DATA_02</FlashcardSecondaryData>
        <FlashcardDetailsContainer details={details} data-testid='secondary' />
      </FlashcardSecondary>
    </Flashcard>,
  );
}

describe('Flashcard', () => {
  it('should render', () => {
    setup();
    expect(screen.getByText('IDENTIFIER')).toBeInTheDocument();
  });

  it('should only show 5 additional details', () => {
    setup();
    const secondaryContainer = screen.getByTestId('secondary');
    expect(secondaryContainer.childElementCount).toBe(5);
  });

  it('should not show secondary data field while loading', () => {
    setup(true);
    const header = screen.queryByText('IDENTIFIER');
    expect(header).toBeNull();
    const secondaryData = screen.queryByText('SECONDARY_DATA');
    expect(secondaryData).toBeNull();
  });
});
