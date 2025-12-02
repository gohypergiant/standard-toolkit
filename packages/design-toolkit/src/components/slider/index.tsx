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
import { clsx } from '@accelint/design-foundation/lib/utils';
import { Fragment, useMemo, useState } from 'react';
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
import styles from './styles.module.css';
import type { SliderMarker, SliderMarkersConfig, SliderProps } from './types';

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
 * Snaps a value to the nearest marker
 */
function snapToNearestMarker(value: number, markers: SliderMarker[]): number {
  if (markers.length === 0) {
    return value;
  }

  const firstMarker = markers[0];
  if (firstMarker === undefined) {
    return value;
  }

  let nearestValue = firstMarker.value;
  let minDistance = Math.abs(value - nearestValue);

  for (const marker of markers) {
    const distance = Math.abs(value - marker.value);
    if (distance < minDistance) {
      minDistance = distance;
      nearestValue = marker.value;
    }
  }

  return nearestValue;
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
  defaultValue,
  label: labelProp,
  layout = 'grid',
  markers: markersProp,
  maxValue: maxValueProp = 100,
  minValue: minValueProp = 0,
  onChange: onChangeProp,
  onChangeEnd: onChangeEndProp,
  orientation = 'horizontal',
  showInput,
  showLabel = true,
  showMarkerLabels = false,
  snapToMarkers = false,
  step: stepProp,
  value: valueProp,
  ...rest
}: SliderProps) {
  const normalizedMarkers = useMemo(
    () => normalizeMarkers(markersProp, minValueProp, maxValueProp),
    [markersProp, minValueProp, maxValueProp],
  );

  // Internal state for controlled snapping behavior
  const [internalValue, setInternalValue] = useState<number[] | undefined>(
    () => {
      if (
        snapToMarkers &&
        normalizedMarkers.length > 0 &&
        defaultValue !== undefined
      ) {
        const values = Array.isArray(defaultValue)
          ? defaultValue
          : [defaultValue];
        return values.map((v) => snapToNearestMarker(v, normalizedMarkers));
      }
      return undefined;
    },
  );

  // Determine if we're in controlled mode
  const isControlled = valueProp !== undefined;

  // When snapToMarkers is enabled and uncontrolled, use internal state
  const shouldUseInternalState =
    snapToMarkers && !isControlled && normalizedMarkers.length > 0;

  // Normalize value props to arrays for AriaSlider
  const normalizedValueProp =
    valueProp !== undefined
      ? Array.isArray(valueProp)
        ? valueProp
        : [valueProp]
      : undefined;
  const normalizedDefaultValue =
    defaultValue !== undefined
      ? Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue]
      : undefined;

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

  // Handle onChange - snap values when snapToMarkers is enabled
  const handleChange = (values: number[]) => {
    if (snapToMarkers && normalizedMarkers.length > 0) {
      const snappedValues = values.map((v) =>
        snapToNearestMarker(v, normalizedMarkers),
      );
      if (shouldUseInternalState) {
        setInternalValue(snappedValues);
      }
      onChangeProp?.(snappedValues);
    } else {
      onChangeProp?.(values);
    }
  };

  // Handle onChangeEnd
  const handleChangeEnd = (values: number[]) => {
    if (snapToMarkers && normalizedMarkers.length > 0) {
      const snappedValues = values.map((v) =>
        snapToNearestMarker(v, normalizedMarkers),
      );
      onChangeEndProp?.(snappedValues);
    } else {
      onChangeEndProp?.(values);
    }
  };

  // Determine the value prop to pass to AriaSlider
  const sliderValue = shouldUseInternalState
    ? internalValue
    : normalizedValueProp;
  const sliderDefaultValue = shouldUseInternalState
    ? undefined
    : normalizedDefaultValue;

  return (
    <AriaSlider
      {...rest}
      className={composeRenderProps(classNames?.slider, (className) =>
        clsx('group/slider', styles.slider, className),
      )}
      defaultValue={sliderDefaultValue}
      maxValue={maxValueProp}
      minValue={minValueProp}
      onChange={handleChange}
      onChangeEnd={handleChangeEnd}
      orientation={orientation}
      step={stepProp}
      value={sliderValue}
      aria-label={showLabel ? undefined : labelProp}
      data-layout={layout}
    >
      {({ state }) => (
        <>
          {showLabel && (
            <Label className={clsx(styles.label, classNames?.label)}>
              {labelProp}
            </Label>
          )}
          {showInput && (
            <div className={clsx(styles.inputs, classNames?.inputs)}>
              {state.values.map((value, index) => (
                <Input
                  key={`number-field-${index === 0 ? 'min' : 'max'}`}
                  className={composeRenderProps(
                    classNames?.input,
                    (className) => clsx(styles.input, className),
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
              clsx(styles.track, className),
            )}
          >
            <div
              className={clsx(
                styles.trackBackground,
                classNames?.trackBackground,
              )}
            />
            {/* Markers */}
            {normalizedMarkers.length > 0 && (
              <div className={clsx(styles.markers, classNames?.markers)}>
                {normalizedMarkers.map((marker) => {
                  const percent = getMarkerPercent(marker.value);
                  const positionStyle =
                    orientation === 'horizontal'
                      ? { left: `${percent}%` }
                      : { bottom: `${percent}%` };

                  return (
                    <div
                      key={`marker-${marker.value}`}
                      className={clsx(styles.marker, classNames?.marker)}
                      style={positionStyle}
                      aria-hidden='true'
                    >
                      <div
                        className={clsx(
                          styles.markerDot,
                          classNames?.markerDot,
                        )}
                      />
                      {showMarkerLabels && marker.label && (
                        <span
                          className={clsx(
                            styles.markerLabel,
                            classNames?.markerLabel,
                          )}
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
                  className={clsx(styles.trackValue, classNames?.trackValue)}
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
                      (className) => clsx(styles.thumb, className),
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
            className={clsx(styles.minValue, classNames?.minValue)}
            hidden={hideMinValue}
          >
            {minValueProp}
          </Text>
          <Text
            slot='max'
            className={clsx(styles.maxValue, classNames?.maxValue)}
            hidden={hideMaxValue}
          >
            {maxValueProp}
          </Text>
        </>
      )}
    </AriaSlider>
  );
}
