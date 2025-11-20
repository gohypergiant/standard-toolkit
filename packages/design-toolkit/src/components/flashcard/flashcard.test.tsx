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
import { Fragment } from 'react/jsx-runtime';
import { describe, expect, it } from 'vitest';
import {
  Flashcard,
  FlashcardAdditionalData,
  FlashcardDetailLabel,
  FlashcardDetailsList,
  FlashcardDetailValue,
  FlashcardHeader,
  FlashcardHero,
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
      <FlashcardHero data-testid='hero'>
        <FlashcardHeader>IDENTIFIER</FlashcardHeader>
        <FlashcardSubheader>DATA</FlashcardSubheader>
      </FlashcardHero>
      <FlashcardAdditionalData>SECONDARY_DATA_01</FlashcardAdditionalData>
      <FlashcardAdditionalData>SECONDARY_DATA_02</FlashcardAdditionalData>
      <FlashcardDetailsList data-testid='secondary'>
        {details.map((detail) => (
          <Fragment key={detail.id}>
            <FlashcardDetailLabel>{detail.label}</FlashcardDetailLabel>
            <FlashcardDetailValue>{detail.value}</FlashcardDetailValue>
          </Fragment>
        ))}
      </FlashcardDetailsList>
    </Flashcard>,
  );
}

describe('Flashcard', () => {
  it('should render', () => {
    setup();
    expect(screen.getByText('IDENTIFIER')).toBeInTheDocument();
  });

  // it('should only show 5 additional details', () => {
  //   setup();

  //   // First item to be hidden by selector nth-of-type
  //   const detailEntries = document.querySelectorAll('nth-of-type(6):hidden');
  //   expect(detailEntries.length).toEqual(16);
  //   console.log(detailEntries[10]);

  //   expect(detailEntries[0]?.checkVisibility()).toBe(false);
  //   expect(detailEntries[10]?.checkVisibility()).toBe(false);
  // });

  it('should not show secondary data field while loading', () => {
    setup(true);

    // Should not render header text.
    const header = screen.queryByText('IDENTIFIER');
    expect(header).toBeNull();

    const hero = screen.getByTestId('hero');
    expect(hero).toBeDefined();

    // Two skellington components
    expect(hero.childElementCount).toEqual(2);
    console.log(hero.childNodes);

    // Should not render FlashcardAdditionalData component.
    const secondaryData = screen.queryByText('SECONDARY_DATA');
    expect(secondaryData).toBeNull();
  });
});
