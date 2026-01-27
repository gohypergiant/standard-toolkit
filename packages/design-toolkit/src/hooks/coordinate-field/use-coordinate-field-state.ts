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

/** Options for the useCoordinateFieldState hook */
export interface UseCoordinateFieldStateOptions {
  /** Controlled coordinate value */
  value?: CoordinateValue | null;
  /** Default value for uncontrolled mode */
  defaultValue?: CoordinateValue;
  /** Coordinate format system (dd, ddm, dms, mgrs, utm) */
  format: CoordinateSystem;
  /** Callback when coordinate value changes */
  onChange?:
    | Dispatch<SetStateAction<CoordinateValue | null>>
    | ((value: CoordinateValue | null) => void);
  /** Callback for validation errors */
  onError?: (message: string, context?: Record<string, unknown>) => void;
  /** Register timeouts for cleanup on unmount */
  registerTimeout?: (timeoutId: NodeJS.Timeout) => void;
}

/** Return value from the useCoordinateFieldState hook */
export interface UseCoordinateFieldStateResult {
  /** Current coordinate value (null if incomplete/invalid) */
  currentValue: CoordinateValue | null;
  /** Array of display values for each segment */
  segmentValues: string[];
  /** Array of validation error messages */
  validationErrors: string[];
  /** All segment configurations including literals */
  segmentConfigs: SegmentConfig[];
  /** Only editable segment configurations */
  editableSegmentConfigs: SegmentConfig[];
  /** Handle change of a single segment */
  handleSegmentChange: (index: number, newValue: string) => void;
  /** Set all segment values at once */
  setSegmentValues: (values: string[]) => void;
  /** Set validation errors */
  setValidationErrors: (errors: string[]) => void;
  /** First validation error or null */
  effectiveErrorMessage: string | null;
  /** Apply a pasted coordinate value */
  applyPastedCoordinate: (pastedValue: CoordinateValue) => void;
  /** Immediately run pending validation */
  flushPendingValidation: () => void;
}

/**
 * Manages coordinate segment values, validation, and format conversion
 *
 * @example
 * ```tsx
 * function CoordinateInputs() {
 *   const [value, setValue] = useState<CoordinateValue | null>(null);
 *   const { registerTimeout } = useTimeoutCleanup();
 *
 *   const {
 *     currentValue,
 *     segmentValues,
 *     validationErrors,
 *     editableSegmentConfigs,
 *     handleSegmentChange,
 *   } = useCoordinateFieldState({
 *     value,
 *     format: 'ddm',
 *     onChange: setValue,
 *     onError: (msg) => console.error(msg),
 *     registerTimeout,
 *   });
 *
 *   return (
 *     <div>
 *       {editableSegmentConfigs.map((config, i) => (
 *         <input
 *           key={i}
 *           value={segmentValues[i]}
 *           onChange={(e) => handleSegmentChange(i, e.target.value)}
 *           placeholder={config.placeholder}
 *         />
 *       ))}
 *       {validationErrors.map((error, i) => (
 *         <span key={i}>{error}</span>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @param options - {@link UseCoordinateFieldStateOptions}
 * @param options.value - Controlled coordinate value.
 * @param options.defaultValue - Default value for uncontrolled mode.
 * @param options.format - Coordinate format system (dd, ddm, dms, mgrs, utm).
 * @param options.onChange - Callback when coordinate value changes.
 * @param options.onError - Callback for validation errors.
 * @param options.registerTimeout - Register timeouts for cleanup on unmount.
 * @returns {@link UseCoordinateFieldStateResult} Segment state, validation, and change handlers.
 */
export function useCoordinateFieldState({
  value,
  defaultValue,
  format,
  onChange,
  onError,
  registerTimeout,
}: UseCoordinateFieldStateOptions): UseCoordinateFieldStateResult {
  const [internalValue, setInternalValue] = useState<CoordinateValue | null>(
    defaultValue || null,
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentValue = value !== undefined ? value : internalValue;

  const clearValidationTimeout = () => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
      validationTimeoutRef.current = null;
    }
  };

  const handleChange = (newValue: CoordinateValue | null) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const segmentConfigs = useMemo(() => getSegmentConfigs(format), [format]);

  const editableSegmentConfigs = useMemo(
    () => segmentConfigs.flat().filter((config) => config.type !== 'literal'),
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
      // Clear any pending validation when value changes
      clearValidationTimeout();

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
      // Clear any pending validation timeout
      clearValidationTimeout();

      // Debounce validation by 400ms when all segments are full
      const timeoutId = setTimeout(() => {
        validateAndUpdateCoordinate(updatedValues);
        validationTimeoutRef.current = null;
      }, 400);

      validationTimeoutRef.current = timeoutId;
      registerTimeout?.(timeoutId);
    } else {
      // Clear any pending validation when segments become incomplete
      clearValidationTimeout();
      setValidationErrors([]);
      if (currentValue !== null) {
        handleChange(null);
      }
    }
  };

  const applyPastedCoordinate = (pastedValue: CoordinateValue) => {
    // Clear any pending validation when applying pasted coordinate
    clearValidationTimeout();

    const segments = convertDDToDisplaySegments(pastedValue, format);

    if (segments) {
      setSegmentValues(segments);
      setValidationErrors([]);
      handleChange(pastedValue);
    }
  };

  const flushPendingValidation = () => {
    if (validationTimeoutRef.current) {
      clearValidationTimeout();

      // Immediately validate if all segments are filled
      if (areAllSegmentsFilled(segmentValues)) {
        validateAndUpdateCoordinate(segmentValues);
      }
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
    flushPendingValidation,
  };
}
