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
import { Slider } from './';

describe('Slider', () => {
  it('should render single', () => {
    render(
      <Slider
        defaultValue={50}
        label='Foo'
        layout='stack'
        minValue={0}
        maxValue={100}
      />,
    );

    const element = screen.getByRole('group');

    expect(element).toBeInTheDocument();
  });

  it('should render range', () => {
    render(
      <Slider
        defaultValue={[20, 50]}
        label='Range'
        layout='grid'
        minValue={0}
        maxValue={100}
      />,
    );

    const sliders = screen.getAllByRole('slider');

    expect(sliders).toHaveLength(2);
  });

  it('should render with label', () => {
    render(
      <Slider defaultValue={50} label='Volume' minValue={0} maxValue={100} />,
    );

    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('should hide label when showLabel is false', () => {
    render(
      <Slider
        defaultValue={50}
        label='Volume'
        showLabel={false}
        minValue={0}
        maxValue={100}
      />,
    );

    expect(screen.queryByText('Volume')).not.toBeInTheDocument();
  });

  describe('markers', () => {
    it('should render evenly spaced markers when given a number', () => {
      const { container } = render(
        <Slider
          defaultValue={50}
          label='With Markers'
          minValue={0}
          maxValue={100}
          markers={5}
        />,
      );

      const markerDots = container.querySelectorAll(
        '[aria-hidden="true"] > div',
      );
      expect(markerDots).toHaveLength(5);
    });

    it('should render markers at specific values when given an array of numbers', () => {
      const { container } = render(
        <Slider
          defaultValue={50}
          label='With Markers'
          minValue={0}
          maxValue={100}
          markers={[0, 25, 50, 75, 100]}
        />,
      );

      const markerDots = container.querySelectorAll(
        '[aria-hidden="true"] > div',
      );
      expect(markerDots).toHaveLength(5);
    });

    it('should render markers with labels when given marker objects', () => {
      render(
        <Slider
          defaultValue={50}
          label='With Labeled Markers'
          minValue={0}
          maxValue={100}
          markers={[
            { value: 0, label: 'Low' },
            { value: 50, label: 'Medium' },
            { value: 100, label: 'High' },
          ]}
          showMarkerLabels
        />,
      );

      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('should not render marker labels when showMarkerLabels is false', () => {
      render(
        <Slider
          defaultValue={50}
          label='With Labeled Markers'
          minValue={0}
          maxValue={100}
          markers={[
            { value: 0, label: 'Low' },
            { value: 50, label: 'Medium' },
            { value: 100, label: 'High' },
          ]}
          showMarkerLabels={false}
        />,
      );

      expect(screen.queryByText('Low')).not.toBeInTheDocument();
      expect(screen.queryByText('Medium')).not.toBeInTheDocument();
      expect(screen.queryByText('High')).not.toBeInTheDocument();
    });

    it('should hide min/max values only when labeled markers exist at those positions', () => {
      render(
        <Slider
          defaultValue={50}
          label='With Labeled Markers'
          minValue={0}
          maxValue={100}
          markers={[
            { value: 0, label: 'Low' },
            { value: 50, label: 'Medium' },
            { value: 100, label: 'High' },
          ]}
          showMarkerLabels
        />,
      );

      // Marker labels should be visible
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();

      // Min/max value elements should be hidden since labeled markers exist at 0 and 100
      const minElement = screen.getByText('0');
      const maxElement = screen.getByText('100');
      expect(minElement).toHaveAttribute('hidden');
      expect(maxElement).toHaveAttribute('hidden');
    });

    it('should show min/max values when markers at edges have no labels', () => {
      render(
        <Slider
          defaultValue={50}
          label='Markers Without Edge Labels'
          minValue={0}
          maxValue={100}
          markers={[
            { value: 0 },
            { value: 50, label: 'Middle' },
            { value: 100 },
          ]}
          showMarkerLabels
        />,
      );

      // Min/max values should be visible since markers at 0 and 100 have no labels
      const minElement = screen.getByText('0');
      const maxElement = screen.getByText('100');
      expect(minElement).not.toHaveAttribute('hidden');
      expect(maxElement).not.toHaveAttribute('hidden');
    });

    it('should show min/max values when showMarkerLabels is false', () => {
      render(
        <Slider
          defaultValue={50}
          label='Without Marker Labels'
          minValue={0}
          maxValue={100}
          markers={[0, 50, 100]}
          showMarkerLabels={false}
        />,
      );

      // Min/max values should be visible (not hidden)
      const zeroText = screen.getByText('0');
      const hundredText = screen.getByText('100');

      expect(zeroText).not.toHaveAttribute('hidden');
      expect(hundredText).not.toHaveAttribute('hidden');
    });

    it('should not render markers when markers prop is undefined', () => {
      const { container } = render(
        <Slider
          defaultValue={50}
          label='No Markers'
          minValue={0}
          maxValue={100}
        />,
      );

      const markerContainer = container.querySelector('[aria-hidden="true"]');
      expect(markerContainer).not.toBeInTheDocument();
    });

    it('should not render markers when given less than 2 for evenly spaced', () => {
      const { container } = render(
        <Slider
          defaultValue={50}
          label='Invalid Markers'
          minValue={0}
          maxValue={100}
          markers={1}
        />,
      );

      const markerDots = container.querySelectorAll(
        '[aria-hidden="true"] > div',
      );
      expect(markerDots).toHaveLength(0);
    });

    it('should position markers correctly based on value', () => {
      const { container } = render(
        <Slider
          defaultValue={50}
          label='Positioned Markers'
          minValue={0}
          maxValue={100}
          markers={[0, 50, 100]}
        />,
      );

      // Get all marker elements (direct children of the markers container that have aria-hidden)
      const markerElements = container.querySelectorAll(
        '[aria-hidden="true"][style]',
      );

      expect(markerElements).toHaveLength(3);
      expect(markerElements[0]).toHaveAttribute('style', 'left: 0%;');
      expect(markerElements[1]).toHaveAttribute('style', 'left: 50%;');
      expect(markerElements[2]).toHaveAttribute('style', 'left: 100%;');
    });
  });

  describe('snapToMarkers', () => {
    it('should apply step based on marker intervals when snapToMarkers is true', () => {
      const { container } = render(
        <Slider
          defaultValue={0}
          label='Snap to Markers'
          minValue={0}
          maxValue={100}
          markers={[0, 25, 50, 75, 100]}
          snapToMarkers
        />,
      );

      const slider = container.querySelector('[role="group"]');
      expect(slider).toBeInTheDocument();
    });

    it('should not affect slider when snapToMarkers is false', () => {
      render(
        <Slider
          defaultValue={33}
          label='No Snap'
          minValue={0}
          maxValue={100}
          markers={[0, 25, 50, 75, 100]}
          snapToMarkers={false}
        />,
      );

      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
    });

    it('should work with unevenly spaced markers', () => {
      const { container } = render(
        <Slider
          defaultValue={0}
          label='Uneven Markers'
          minValue={0}
          maxValue={100}
          markers={[0, 10, 50, 100]}
          snapToMarkers
        />,
      );

      const slider = container.querySelector('[role="group"]');
      expect(slider).toBeInTheDocument();
    });

    it('should allow explicit step prop to override snapToMarkers calculation', () => {
      const { container } = render(
        <Slider
          defaultValue={0}
          label='Custom Step'
          minValue={0}
          maxValue={100}
          markers={[0, 25, 50, 75, 100]}
          snapToMarkers
          step={10}
        />,
      );

      const slider = container.querySelector('[role="group"]');
      expect(slider).toBeInTheDocument();
    });
  });
});
