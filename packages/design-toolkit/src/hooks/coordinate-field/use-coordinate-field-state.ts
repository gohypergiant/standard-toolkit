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

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  areAllSegmentsFilled,
  convertDDToDisplaySegments,
  convertDisplaySegmentsToDD,
  validateCoordinateSegments,
} from '../../components/coordinate-field/coordinate-utils';
import { getSegmentConfigs } from '../../components/coordinate-field/segment-configs';
import type {
  CoordinateSystem,
  CoordinateValue,
  SegmentConfig,
} from '../../components/coordinate-field/types';

export interface UseCoordinateFieldStateOptions {
  value?: CoordinateValue | null;
  defaultValue?: CoordinateValue;
  format: CoordinateSystem;
  onChange?:
    | Dispatch<SetStateAction<CoordinateValue | null>>
    | ((value: CoordinateValue | null) => void);
  onError?: (message: string, context?: Record<string, unknown>) => void;
}

export interface UseCoordinateFieldStateResult {
  currentValue: CoordinateValue | null;
  segmentValues: string[];
  validationErrors: string[];
  segmentConfigs: SegmentConfig[];
  editableSegmentConfigs: SegmentConfig[];
  handleSegmentChange: (index: number, newValue: string) => void;
  setSegmentValues: (values: string[]) => void;
  setValidationErrors: (errors: string[]) => void;
  effectiveErrorMessage: string | null;
  applyPastedCoordinate: (pastedValue: CoordinateValue) => void;
}

export function useCoordinateFieldState({
  value,
  defaultValue,
  format,
  onChange,
  onError,
}: UseCoordinateFieldStateOptions): UseCoordinateFieldStateResult {
  const [internalValue, setInternalValue] = useState<CoordinateValue | null>(
    defaultValue || null,
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (newValue: CoordinateValue | null) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const segmentConfigs = useMemo(() => getSegmentConfigs(format), [format]);

  const editableSegmentConfigs = useMemo(
    () => segmentConfigs.filter((config) => config.type !== 'literal'),
    [segmentConfigs],
  );

  const [segmentValues, setSegmentValues] = useState<string[]>(() => {
    const initialValue = value !== undefined ? value : defaultValue;
    if (!initialValue) {
      return new Array(editableSegmentConfigs.length).fill('');
    }

    const segments = convertDDToDisplaySegments(initialValue, format);
    if (!segments) {
      return new Array(editableSegmentConfigs.length).fill('');
    }

    return segments;
  });

  const convertValueToSegmentsOrClear = useCallback(
    (valueToConvert: CoordinateValue | null) => {
      const segments = valueToConvert
        ? convertDDToDisplaySegments(valueToConvert, format)
        : null;

      setSegmentValues(
        segments || new Array(editableSegmentConfigs.length).fill(''),
      );
      setValidationErrors([]);
    },
    [format, editableSegmentConfigs.length],
  );

  const prevFormatRef = useRef(format);

  useEffect(() => {
    if (prevFormatRef.current !== format) {
      prevFormatRef.current = format;
      const valueToConvert = value !== undefined ? value : internalValue;
      convertValueToSegmentsOrClear(valueToConvert);
    }
  }, [format, value, internalValue, convertValueToSegmentsOrClear]);

  useEffect(() => {
    if (value !== undefined) {
      convertValueToSegmentsOrClear(value);
    }
  }, [value, convertValueToSegmentsOrClear]);

  /**
   * Validates segment values and updates the coordinate state
   *
   * When validation fails, calls onError with "Invalid coordinate value" message
   * and context containing the detailed validation errors from @accelint/geo.
   *
   * @param updatedValues - Array of segment values to validate
   */
  const validateAndUpdateCoordinate = (updatedValues: string[]) => {
    const errors = validateCoordinateSegments(updatedValues, format);

    if (errors.length > 0) {
      setValidationErrors(errors);
      onError?.('Invalid coordinate value', {
        errors,
        format,
        segments: updatedValues,
      });
      handleChange(null);
      return;
    }

    const ddValue = convertDisplaySegmentsToDD(updatedValues, format);
    if (!ddValue) {
      const errorMsg = 'Invalid coordinate value';
      setValidationErrors([errorMsg]);
      onError?.(errorMsg, { format, segments: updatedValues });
      handleChange(null);
      return;
    }

    setValidationErrors([]);
    handleChange(ddValue);
  };

  const handleSegmentChange = (index: number, newValue: string) => {
    const updatedValues = [...segmentValues];
    updatedValues[index] = newValue;
    setSegmentValues(updatedValues);

    if (areAllSegmentsFilled(updatedValues)) {
      validateAndUpdateCoordinate(updatedValues);
    } else {
      setValidationErrors([]);
      if (currentValue !== null) {
        handleChange(null);
      }
    }
  };

  const applyPastedCoordinate = (pastedValue: CoordinateValue) => {
    const segments = convertDDToDisplaySegments(pastedValue, format);

    if (segments) {
      setSegmentValues(segments);
      setValidationErrors([]);
      handleChange(pastedValue);
    }
  };

  const effectiveErrorMessage = useMemo(
    () => validationErrors[0] || null,
    [validationErrors],
  );

  return {
    currentValue,
    segmentValues,
    validationErrors,
    segmentConfigs,
    editableSegmentConfigs,
    handleSegmentChange,
    setSegmentValues,
    setValidationErrors,
    effectiveErrorMessage,
    applyPastedCoordinate,
  };
}
