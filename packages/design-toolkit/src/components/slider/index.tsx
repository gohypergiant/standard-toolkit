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
import { useControlledState } from '@react-stately/utils';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
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

const DEBOUNCE_MS = 500;

/**
 * SliderInput - Internal component for debounced numeric input
 */
function SliderInput({
  className,
  value,
  min,
  max,
  disabled,
  onChange,
}: {
  className?: string;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  const [localValue, setLocalValue] = useState(String(value));
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sync local value when external value changes (e.g., from slider drag)
  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const commitValue = (inputValue: string) => {
    const parsed = Number.parseFloat(inputValue);
    if (Number.isNaN(parsed)) {
      // Reset to min if invalid
      setLocalValue(String(min));
      onChange(min);
    } else {
      // Clamp to valid range
      const clamped = Math.min(Math.max(parsed, min), max);
      setLocalValue(String(clamped));
      onChange(clamped);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalValue(newValue);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the commit
    timeoutRef.current = setTimeout(() => {
      commitValue(newValue);
    }, DEBOUNCE_MS);
  };

  const handleBlur = () => {
    // Clear pending timeout and commit immediately
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    commitValue(localValue);
  };

  return (
    <Input
      className={className}
      value={localValue}
      disabled={disabled}
      data-disabled={disabled || undefined}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}

/**
 * Normalizes the markers configuration into a consistent sorted array format
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

  // Array of numbers or marker objects - sort by value
  return markersConfig
    .map((item) => (typeof item === 'number' ? { value: item } : item))
    .sort((a, b) => a.value - b.value);
}

/**
 * Snaps a value to the nearest marker (curried for use with map)
 * Assumes markers are sorted by value for early exit optimization
 */
function snapToNearestMarker(markers: SliderMarker[]) {
  return (value: number): number => {
    const firstMarker = markers[0];
    if (!firstMarker) {
      return value;
    }

    let nearestValue = firstMarker.value;
    let minDistance = Number.POSITIVE_INFINITY;

    for (const marker of markers) {
      const distance = Math.abs(value - marker.value);
      if (distance < minDistance) {
        minDistance = distance;
        nearestValue = marker.value;
      } else {
        // Since markers are sorted, if distance increases we've passed the nearest
        break;
      }
    }

    return nearestValue;
  };
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
 * Normalizes value to array format
 */
function normalizeValue(
  value: number | number[] | undefined,
): number[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  return Array.isArray(value) ? value : [value];
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
  onChange,
  onChangeEnd,
  orientation = 'horizontal',
  showInput,
  showLabel = true,
  showMarkerLabels = false,
  showValueLabels = true,
  snapToMarkers = false,
  step: stepProp,
  value: valueProp,
  ...rest
}: SliderProps) {
  const normalizedMarkers = useMemo(
    () => normalizeMarkers(markersProp, minValueProp, maxValueProp),
    [markersProp, minValueProp, maxValueProp],
  );

  const shouldSnap = snapToMarkers && normalizedMarkers.length > 0;

  // Normalize default value, applying snap if needed
  const normalizedDefaultValue = useMemo(() => {
    const normalized = normalizeValue(defaultValue);
    if (shouldSnap && normalized) {
      return normalized.map(snapToNearestMarker(normalizedMarkers));
    }
    return normalized ?? [minValueProp];
  }, [defaultValue, shouldSnap, normalizedMarkers, minValueProp]);

  // Use controlled state for value management
  const [value, setValue] = useControlledState(
    normalizeValue(valueProp),
    normalizedDefaultValue,
    onChange,
  );

  // Memoize marker percent calculations
  const markerPercents = useMemo(() => {
    const percents = new Map<number, number>();
    const range = maxValueProp - minValueProp;
    for (const marker of normalizedMarkers) {
      percents.set(marker.value, ((marker.value - minValueProp) / range) * 100);
    }
    return percents;
  }, [normalizedMarkers, minValueProp, maxValueProp]);

  // Determine if min/max labels should be hidden
  const hideMinValue =
    !showValueLabels ||
    (showMarkerLabels &&
      hasLabeledMarkerAtValue(normalizedMarkers, minValueProp));
  const hideMaxValue =
    !showValueLabels ||
    (showMarkerLabels &&
      hasLabeledMarkerAtValue(normalizedMarkers, maxValueProp));

  // Handle onChange - snap values when snapToMarkers is enabled
  const handleChange = (values: number[]) => {
    if (shouldSnap) {
      setValue(values.map(snapToNearestMarker(normalizedMarkers)));
    } else {
      setValue(values);
    }
  };

  // Handle onChangeEnd
  const handleChangeEnd = (values: number[]) => {
    if (shouldSnap) {
      onChangeEnd?.(values.map(snapToNearestMarker(normalizedMarkers)));
    } else {
      onChangeEnd?.(values);
    }
  };

  return (
    <AriaSlider
      {...rest}
      className={composeRenderProps(classNames?.slider, (className) =>
        clsx('group/slider', styles.slider, className),
      )}
      maxValue={maxValueProp}
      minValue={minValueProp}
      onChange={handleChange}
      onChangeEnd={handleChangeEnd}
      orientation={orientation}
      step={stepProp}
      value={value}
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
              {state.values.map((val, index) => (
                <SliderInput
                  key={`number-field-${index === 0 ? 'min' : 'max'}`}
                  className={clsx(styles.input, classNames?.input)}
                  value={val}
                  min={minValueProp}
                  max={maxValueProp}
                  disabled={state.isDisabled}
                  onChange={(newValue) => state.setThumbValue(index, newValue)}
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
                {normalizedMarkers.map((marker) => (
                  <div
                    key={`marker-${marker.value}`}
                    className={clsx(styles.marker, classNames?.marker)}
                    data-percent={markerPercents.get(marker.value)}
                    aria-hidden='true'
                  >
                    <div
                      className={clsx(styles.markerDot, classNames?.markerDot)}
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
                ))}
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
