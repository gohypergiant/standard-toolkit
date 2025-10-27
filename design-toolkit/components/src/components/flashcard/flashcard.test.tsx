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

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Flashcard } from '.';

function setup() {
  const details = [
    { label: 'key', value: 'value' },
    { label: 'key', value: 'value' },
    { label: 'key', value: 'value' },
    { label: 'key', value: 'value' },
    { label: 'key', value: 'value' },
  ];

  render(
    <Flashcard>
      <Flashcard.Hero>
        <Flashcard.Identifier>IDENTIFIER</Flashcard.Identifier>
      </Flashcard.Hero>
      <Flashcard.Secondary>
        <Flashcard.SecondaryData>SECONDARY_DATA_01</Flashcard.SecondaryData>
        <Flashcard.SecondaryData>SECONDARY_DATA_02</Flashcard.SecondaryData>
        {details.map((item) => (
          <Flashcard.Details
            label={item.label}
            value={item.value}
            key={item.label}
          />
        ))}
      </Flashcard.Secondary>
    </Flashcard>,
  );
}

describe('Flashcard', () => {
  it('should render', () => {
    setup();
    expect(screen.findByText('IDENTIFIER')).toBeInTheDocument();
  });
});
