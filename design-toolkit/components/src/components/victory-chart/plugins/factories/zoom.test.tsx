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
import { factoryForZoom } from './zoom';
import type React from 'react';
import type { ChartState } from '../../lib/chart-state';

vi.mock('../range', () => {
  // biome-ignore lint/suspicious/noExplicitAny: testing
  const MockRange = (props: any) => (
    <div data-testid='mock-range'>
      {JSON.stringify(props)}
      <input
        type='range'
        // intentionally a higher number so that an invalid value can be selected for testing purposes
        max={600}
        min={100}
        data-testid='mock-range-input'
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

describe('Plugin Factory for zoom', () => {
  const mockOnUpdate = vi.fn();
  const mockState: ChartState = {
    data: [],
    focus: 24,
    zoom: 100,
  };

  it('should not render a component', () => {
    const result = factoryForZoom({ zoom: false });

    expect(result).toBe(false);
  });

  it('should render Range component with correct props', () => {
    const ZoomComponent = factoryForZoom({}) as React.FC<any>;
    const { getByTestId } = render(
      <ZoomComponent onUpdate={mockOnUpdate} state={mockState} />,
    );
    const mockRangeElement = getByTestId('mock-range');
    const expectedProps = {
      altText: 'How big to make the timeline.',
      label: 'Zoom',
      max: 500,
      min: 100,
      // onUpdate
      preview: '100%',
      value: 100,
    };

    expect(mockRangeElement).toBeInTheDocument();
    expect(JSON.parse(mockRangeElement.textContent ?? '')).toEqual(
      expectedProps,
    );
  });

  it('should call onUpdate with correct zoom value when range is changed', () => {
    const ZoomComponent = factoryForZoom({}) as React.FC<any>;
    const { getByTestId } = render(
      <ZoomComponent onUpdate={mockOnUpdate} state={mockState} />,
    );
    const rangeInputElement = getByTestId('mock-range-input');

    fireEvent.change(rangeInputElement, { target: { value: '300' } });

    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    expect(mockOnUpdate).toHaveBeenCalledWith({ zoom: 300 });
  });

  it('should render custom component when zoom is a React component', () => {
    const CustomComponent = () => (
      <div data-testid='custom-component'>Custom Zoom</div>
    );
    const ZoomComponent = factoryForZoom({
      zoom: CustomComponent,
      // biome-ignore lint/suspicious/noExplicitAny: testing
    }) as React.FC<any>;
    const { getByTestId } = render(
      <ZoomComponent onUpdate={mockOnUpdate} state={mockState} />,
    );
    const customComponentElement = getByTestId('custom-component');

    expect(customComponentElement).toBeInTheDocument();
  });
});
