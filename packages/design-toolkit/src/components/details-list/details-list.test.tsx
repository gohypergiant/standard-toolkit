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
import { Fragment } from 'react';
import { describe, expect, it } from 'vitest';
import { DetailsList } from './';
import { DetailsListLabel } from './label';
import { DetailsListValue } from './value';
import type { DetailsListProps } from './types';

const defaults = {
  Location: 'New York, NY',
  Status: 'Active',
};

function setup({
  children = (
    <>
      {Object.entries(defaults).map(([label, value]: [string, string]) => (
        <Fragment key={label}>
          <DetailsListLabel>{label}</DetailsListLabel>
          <DetailsListValue>{value}</DetailsListValue>
        </Fragment>
      ))}
    </>
  ),
  ...rest
}: Partial<DetailsListProps> = {}) {
  return {
    ...render(<DetailsList {...rest}>{children}</DetailsList>),
    ...rest,
    children,
  };
}

describe('DetailsList', () => {
  it('renders basic details list structure', () => {
    setup();

    // Check semantic structure - use querySelector since dl doesn't have role="list"
    expect(document.querySelector('dl')).toBeInTheDocument();

    for (const [label, value] of Object.entries(defaults)) {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(value)).toBeInTheDocument();
    }
  });
});
