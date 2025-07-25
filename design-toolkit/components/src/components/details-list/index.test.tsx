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
import { DetailsList } from './index';

describe('DetailsList', () => {
  it('renders basic details list structure', () => {
    render(
      <DetailsList>
        <DetailsList.Label>Location</DetailsList.Label>
        <DetailsList.Value>New York, NY</DetailsList.Value>

        <DetailsList.Label>Status</DetailsList.Label>
        <DetailsList.Value>Active</DetailsList.Value>
      </DetailsList>,
    );

    // Check semantic structure - use querySelector since dl doesn't have role="list"
    const list = document.querySelector('dl');
    expect(list).toBeInTheDocument();
    expect(list?.tagName).toBe('DL');

    // Check labels
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    // Check values
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('supports multiple values per label', () => {
    render(
      <DetailsList>
        <DetailsList.Label>Coordinates</DetailsList.Label>
        <DetailsList.Value>40.7128° N</DetailsList.Value>
        <DetailsList.Value>74.0060° W</DetailsList.Value>

        <DetailsList.Label>Tags</DetailsList.Label>
        <DetailsList.Value>Important</DetailsList.Value>
        <DetailsList.Value>Verified</DetailsList.Value>
        <DetailsList.Value>Public</DetailsList.Value>
      </DetailsList>,
    );

    expect(screen.getByText('40.7128° N')).toBeInTheDocument();
    expect(screen.getByText('74.0060° W')).toBeInTheDocument();
    expect(screen.getByText('Important')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('Public')).toBeInTheDocument();
  });

  it('applies custom className to main container', () => {
    render(
      <DetailsList className='custom-class'>
        <DetailsList.Label>Test</DetailsList.Label>
        <DetailsList.Value>Value</DetailsList.Value>
      </DetailsList>,
    );

    const list = document.querySelector('dl');
    expect(list).toHaveClass('custom-class');
  });

  it('supports custom props and attributes', () => {
    render(
      <DetailsList data-testid='details-list' aria-label='Map object details'>
        <DetailsList.Label data-testid='label'>Location</DetailsList.Label>
        <DetailsList.Value data-testid='value'>New York</DetailsList.Value>
      </DetailsList>,
    );

    expect(screen.getByTestId('details-list')).toHaveAttribute(
      'aria-label',
      'Map object details',
    );
    expect(screen.getByTestId('label')).toBeInTheDocument();
    expect(screen.getByTestId('value')).toBeInTheDocument();
  });

  it('applies alignment variants correctly', () => {
    render(
      <DetailsList
        data-testid='details-list'
        justifyLabel='right'
        justifyValue='center'
      >
        <DetailsList.Label data-testid='label'>Test Label</DetailsList.Label>
        <DetailsList.Value data-testid='value'>Test Value</DetailsList.Value>
      </DetailsList>,
    );

    const list = screen.getByTestId('details-list');
    const label = screen.getByTestId('label');
    const value = screen.getByTestId('value');

    expect(list).toBeInTheDocument();
    expect(label).toHaveClass('text-right');
    expect(value).toHaveClass('text-center');
  });

  it('applies spacing variants correctly', () => {
    render(
      <DetailsList data-testid='details-list' spacing='large'>
        <DetailsList.Label>Test Label</DetailsList.Label>
        <DetailsList.Value>Test Value</DetailsList.Value>
      </DetailsList>,
    );

    const list = screen.getByTestId('details-list');
    expect(list).toHaveClass('gap-x-l', 'gap-y-m');
  });

  it('uses default variants when none specified', () => {
    render(
      <DetailsList data-testid='details-list'>
        <DetailsList.Label data-testid='label'>Default Label</DetailsList.Label>
        <DetailsList.Value data-testid='value'>Default Value</DetailsList.Value>
      </DetailsList>,
    );

    const list = screen.getByTestId('details-list');
    const label = screen.getByTestId('label');
    const value = screen.getByTestId('value');

    expect(list).toHaveClass('gap-x-m', 'gap-y-s'); // default spacing: medium
    expect(label).toHaveClass('text-left'); // default justifyLabel: left
    expect(value).toHaveClass('text-left'); // default justifyValue: left
  });
});
