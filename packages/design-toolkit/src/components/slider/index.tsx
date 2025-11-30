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
'use client';

import 'client-only';
import { Fragment, useMemo } from 'react';
import {
  Slider as AriaSlider,
  SliderTrack as AriaSliderTrack,
  composeRenderProps,
  Input,
  Label,
  SliderThumb,
  Text,
} from 'react-aria-components';
import { Tooltip } from '../tooltip';
import { TooltipTrigger } from '../tooltip/trigger';
import { SliderStyles } from './styles';
import type { SliderMarker, SliderMarkersConfig, SliderProps } from './types';

const {
  slider,
  label,
  inputs,
  input,
  thumb,
  track,
  trackBackground,
  trackValue,
  minValue,
  maxValue,
  markers: markersStyle,
  marker: markerStyle,
  markerDot,
  markerLabel,
} = SliderStyles();

/**
 * Normalizes the markers configuration into a consistent array format
 */
function normalizeMarkers(
  markersConfig: SliderMarkersConfig | undefined,
  min: number,
  max: number,
): SliderMarker[] {
  if (markersConfig === undefined) {
    return [];
  }

  // Number of evenly spaced markers
  if (typeof markersConfig === 'number') {
    if (markersConfig < 2) {
      return [];
    }
    const step = (max - min) / (markersConfig - 1);
    return Array.from({ length: markersConfig }, (_, i) => ({
      value: min + step * i,
    }));
  }

  // Array of numbers or marker objects
  if (Array.isArray(markersConfig)) {
    return markersConfig.map((item) =>
      typeof item === 'number' ? { value: item } : item,
    );
  }

  return [];
}

/**
 * Calculates the greatest common divisor of marker intervals
 * to determine an appropriate step value for snapping
 */
function calculateStepFromMarkers(
  markers: SliderMarker[],
  min: number,
): number | undefined {
  if (markers.length < 2) {
    return undefined;
  }

  // Sort markers by value
  const sortedValues = [...markers.map((m) => m.value)].sort((a, b) => a - b);

  // Calculate GCD of all intervals
  const gcd = (num1: number, num2: number): number => {
    // Handle floating point by working with a precision
    const precision = 1e-10;
    let a = Math.abs(num1);
    let b = Math.abs(num2);
    while (b > precision) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  // Find GCD of all differences between consecutive markers
  const firstValue = sortedValues[0];
  const secondValue = sortedValues[1];

  if (firstValue === undefined || secondValue === undefined) {
    return undefined;
  }

  let step = secondValue - firstValue;
  for (let i = 2; i < sortedValues.length; i++) {
    const currentValue = sortedValues[i];
    const previousValue = sortedValues[i - 1];
    if (currentValue !== undefined && previousValue !== undefined) {
      step = gcd(step, currentValue - previousValue);
    }
  }

  // Also ensure step works from min value
  if (firstValue !== min) {
    step = gcd(step, firstValue - min);
  }

  return step > 0 ? step : undefined;
}

/**
 * Checks if a marker with a label exists at the given value
 */
function hasLabeledMarkerAtValue(
  markers: SliderMarker[],
  value: number,
): boolean {
  return markers.some(
    (marker) =>
      marker.value === value &&
      marker.label !== undefined &&
      marker.label !== '',
  );
}

/**
 * Slider - An interactive range input component for numeric value selection
 *
 * Provides accessible slider functionality with optional input field integration,
 * flexible layouts, and comprehensive keyboard and mouse interaction support.
 * Perfect for settings, filters, or any numeric input requiring visual feedback.
 *
 * @example
 * // Basic slider
 * <Slider label="Volume" defaultValue={50} />
 *
 * @example
 * // Slider with input field
 * <Slider label="Opacity" defaultValue={50} showInput />
 *
 * @example
 * // Slider with evenly spaced markers
 * <Slider label="Progress" markers={5} />
 *
 * @example
 * // Slider with specific marker values
 * <Slider label="Temperature" markers={[0, 25, 50, 75, 100]} />
 *
 * @example
 * // Slider with labeled markers
 * <Slider
 *   label="Quality"
 *   markers={[
 *     { value: 0, label: 'Low' },
 *     { value: 50, label: 'Medium' },
 *     { value: 100, label: 'High' },
 *   ]}
 *   showMarkerLabels
 * />
 *
 * @example
 * // Slider that snaps to marker values only
 * <Slider
 *   label="Rating"
 *   markers={[0, 25, 50, 75, 100]}
 *   snapToMarkers
 * />
 */
export function Slider({
  classNames,
  label: labelProp,
  layout = 'grid',
  markers: markersProp,
  maxValue: maxValueProp = 100,
  minValue: minValueProp = 0,
  orientation = 'horizontal',
  showInput,
  showLabel = true,
  showMarkerLabels = false,
  snapToMarkers = false,
  step: stepProp,
  ...rest
}: SliderProps) {
  const normalizedMarkers = useMemo(
    () => normalizeMarkers(markersProp, minValueProp, maxValueProp),
    [markersProp, minValueProp, maxValueProp],
  );

  // Calculate step for snapping to markers
  const calculatedStep = useMemo(() => {
    if (snapToMarkers && normalizedMarkers.length >= 2) {
      return calculateStepFromMarkers(normalizedMarkers, minValueProp);
    }
    return undefined;
  }, [snapToMarkers, normalizedMarkers, minValueProp]);

  // Use provided step, or calculated step if snapToMarkers is enabled
  const effectiveStep = stepProp ?? calculatedStep;

  // Determine if min/max labels should be hidden (only when labeled markers exist at those values)
  const hideMinValue =
    showMarkerLabels &&
    hasLabeledMarkerAtValue(normalizedMarkers, minValueProp);
  const hideMaxValue =
    showMarkerLabels &&
    hasLabeledMarkerAtValue(normalizedMarkers, maxValueProp);

  const getMarkerPercent = (value: number) => {
    return ((value - minValueProp) / (maxValueProp - minValueProp)) * 100;
  };

  return (
    <AriaSlider
      {...rest}
      className={composeRenderProps(classNames?.slider, (className) =>
        slider({ className }),
      )}
      maxValue={maxValueProp}
      minValue={minValueProp}
      orientation={orientation}
      step={effectiveStep}
      aria-label={showLabel ? undefined : labelProp}
      data-layout={layout}
    >
      {({ state }) => (
        <>
          {showLabel && (
            <Label className={label({ className: classNames?.label })}>
              {labelProp}
            </Label>
          )}
          {showInput && (
            <div className={inputs({ className: classNames?.inputs })}>
              {state.values.map((value, index) => (
                <Input
                  key={`number-field-${index === 0 ? 'min' : 'max'}`}
                  className={composeRenderProps(
                    classNames?.input,
                    (className) => input({ className }),
                  )}
                  value={value}
                  disabled={state.isDisabled}
                  data-disabled={state.isDisabled || undefined}
                  onChange={(event) =>
                    state.setThumbValue(
                      index,
                      Number.parseFloat(event.target.value),
                    )
                  }
                />
              ))}
            </div>
          )}
          <AriaSliderTrack
            className={composeRenderProps(classNames?.track, (className) =>
              track({ className }),
            )}
          >
            <div
              className={trackBackground({
                className: classNames?.trackBackground,
              })}
            />
            {/* Markers */}
            {normalizedMarkers.length > 0 && (
              <div className={markersStyle({ className: classNames?.markers })}>
                {normalizedMarkers.map((marker) => {
                  const percent = getMarkerPercent(marker.value);
                  const positionStyle =
                    orientation === 'horizontal'
                      ? { left: `${percent}%` }
                      : { bottom: `${percent}%` };

                  return (
                    <div
                      key={`marker-${marker.value}`}
                      className={markerStyle({ className: classNames?.marker })}
                      style={positionStyle}
                      aria-hidden='true'
                    >
                      <div
                        className={markerDot({
                          className: classNames?.markerDot,
                        })}
                      />
                      {showMarkerLabels && marker.label && (
                        <span
                          className={markerLabel({
                            className: classNames?.markerLabel,
                          })}
                        >
                          {marker.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {state.values.map((_, index) => (
              <Fragment key={`slider-${index === 0 ? 'min' : 'max'}`}>
                <div
                  className={trackValue({
                    className: classNames?.trackValue,
                  })}
                  data-start={
                    state.values.length === 1 ? 0 : state.getThumbPercent(0)
                  }
                  data-end={state.getThumbPercent(
                    state.values.length === 1 ? 0 : 1,
                  )}
                />
                <TooltipTrigger
                  isDisabled={showInput || state.isThumbDragging(index)}
                >
                  <SliderThumb
                    index={index}
                    className={composeRenderProps(
                      classNames?.thumb,
                      (className) => thumb({ className }),
                    )}
                  />
                  <Tooltip placement='top'>
                    {state.getThumbValue(index)}
                  </Tooltip>
                </TooltipTrigger>
              </Fragment>
            ))}
          </AriaSliderTrack>
          <Text
            slot='min'
            className={minValue({ className: classNames?.minValue })}
            hidden={hideMinValue}
          >
            {minValueProp}
          </Text>
          <Text
            slot='max'
            className={maxValue({ className: classNames?.maxValue })}
            hidden={hideMaxValue}
          >
            {maxValueProp}
          </Text>
        </>
      )}
    </AriaSlider>
  );
}
