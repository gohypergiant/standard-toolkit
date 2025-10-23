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

import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { factoryForFocus } from './focus';
import type React from 'react';
import type { ChartState } from '../../lib/chart-state';

vi.mock('../range', () => {
  const MockRange = (props: any) => (
    <div data-testid='mock-range'>
      {JSON.stringify(props)}
      <input
        type='range'
        data-testid='mock-range-input'
        // intentionally a higher number so that an invalid value can be selected for testing purposes
        max={8}
        min={0}
        onChange={(e) => {
          props.onUpdate({ target: { value: e.target.value } });
        }}
      />
    </div>
  );

  return {
    Range: MockRange,
  };
});

describe('Plugin Factory for focus', () => {
  const mockOnUpdate = vi.fn();
  const mockState: ChartState = {
    data: [],
    focus: 24,
    zoom: 100,
  };

  it('should not render a component', () => {
    const result = factoryForFocus({ focus: false });

    expect(result).toBe(false);
  });

  it('should render Range component with correct props', () => {
    const FocusComponent = factoryForFocus({}) as React.FC<any>;
    const { getByTestId } = render(
      <FocusComponent onUpdate={mockOnUpdate} state={mockState} />,
    );
    const mockRangeElement = getByTestId('mock-range');
    const expectedProps = {
      altText: 'How much time will be shown in the timeline.',
      label: 'Focus',
      max: 7,
      min: 0,
      // onUpdate
      preview: '24 hours',
      step: 1,
      value: 4,
    };

    expect(mockRangeElement).toBeInTheDocument();
    expect(JSON.parse(mockRangeElement.textContent ?? '')).toEqual(
      expectedProps,
    );
  });

  it('should call onUpdate with correct focus value when range is changed', () => {
    const FocusComponent = factoryForFocus({}) as React.FC<any>;
    const { getByTestId } = render(
      <FocusComponent onUpdate={mockOnUpdate} state={mockState} />,
    );
    const rangeInputElement = getByTestId('mock-range-input');

    fireEvent.change(rangeInputElement, { target: { value: 2 } });

    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    expect(mockOnUpdate).toHaveBeenCalledWith({ focus: 8 });
  });

  it('should render custom component when focus is a React component', () => {
    const CustomComponent = () => (
      <div data-testid='custom-component'>Custom Focus</div>
    );
    const FocusComponent = factoryForFocus({
      focus: CustomComponent,
    }) as React.FC<any>;
    const { getByTestId } = render(
      <FocusComponent onUpdate={mockOnUpdate} state={mockState} />,
    );
    const customComponentElement = getByTestId('custom-component');

    expect(customComponentElement).toBeInTheDocument();
  });

  it('should fallback to default value if invalid number is provided to onUpdate', () => {
    const FocusComponent = factoryForFocus({}) as React.FC<any>;
    const { getByTestId } = render(
      <FocusComponent onUpdate={mockOnUpdate} state={mockState} />,
    );
    const rangeInputElement = getByTestId('mock-range-input');

    fireEvent.change(rangeInputElement, { target: { value: 99 } });

    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    expect(mockOnUpdate).toHaveBeenCalledWith({ focus: 24 });
  });

  it('should render with correct props even if invalid state it provided', () => {
    const FocusComponent = factoryForFocus({}) as React.FC<any>;
    const { getByTestId } = render(
      <FocusComponent
        onUpdate={mockOnUpdate}
        state={{ ...mockState, focus: 9999 }}
      />,
    );
    const mockRangeElement = getByTestId('mock-range');
    const expectedProps = {
      altText: 'How much time will be shown in the timeline.',
      label: 'Focus',
      max: 7,
      min: 0,
      // onUpdate
      preview: '24 hours',
      step: 1,
      value: 4,
    };

    expect(mockRangeElement).toBeInTheDocument();
    expect(JSON.parse(mockRangeElement.textContent ?? '')).toEqual(
      expectedProps,
    );
  });
});
