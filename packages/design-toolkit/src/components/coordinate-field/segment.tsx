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
import { useMemo } from 'react';
import { useCoordinateFieldStateContext } from './context';
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import type { CoordinateSegmentProps } from './types';

/**
 * CoordinateSegment - A controlled input component for a single coordinate segment
 *
 * This component represents one editable part of a coordinate (e.g., degrees, minutes, direction).
 * It handles character filtering, focus management, and keyboard navigation.
 *
 * Segment Types (determined by allowedChars):
 * - Numeric: "[0-9\\-\\.]" - for DD degrees, DDM/DMS degrees/minutes/seconds
 * - Directional: "[NSEW]" - for DDM/DMS direction indicators
 * - Alphanumeric: "[0-9A-Z]" - for MGRS/UTM zone identifiers
 *
 * @example
 * // Numeric segment (latitude degrees)
 * <CoordinateSegment
 *   value={latDegrees}
 *   onChange={setLatDegrees}
 *   allowedChars="[0-9\\-\\.]"
 *   maxLength={10}
 *   placeholder="00.00000"
 * />
 *
 * @example
 * // Directional segment (latitude direction)
 * <CoordinateSegment
 *   value={latDir}
 *   onChange={setLatDir}
 *   allowedChars="[NS]"
 *   maxLength={1}
 *   placeholder="N"
 * />
 */
export function CoordinateSegment({
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  placeholder,
  maxLength,
  className,
  isDisabled,
  allowedChars,
  segmentRef,
  segmentIndex,
  totalSegments: _totalSegments,
  onAutoAdvance,
  onAutoRetreat,
  pad,
  ariaLabel,
}: CoordinateSegmentProps) {
  const contextState = useCoordinateFieldStateContext();

  const effectiveIsDisabled = contextState.isDisabled ?? isDisabled;

  // Calculate dynamic width based on focus state
  const dynamicWidth = useMemo(() => {
    if (maxLength === undefined) {
      return undefined;
    }

    // Default padding to 0.5 if not specified
    const padding = pad ?? 0.5;

    // When blurred, use value length (or maxLength if empty) + padding
    const contentLength = value.length > 0 ? value.length : maxLength;
    return contentLength + padding;
  }, [maxLength, pad, value.length]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (allowedChars) {
      const regex = new RegExp(`^${allowedChars}*$`);
      if (!regex.test(newValue)) {
        return;
      }
    }

    if (maxLength && newValue.length > maxLength) {
      return;
    }

    onChange(newValue);

    if (maxLength && newValue.length === maxLength && onAutoAdvance) {
      setTimeout(() => {
        onAutoAdvance();
      }, 0);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');

    if (allowedChars) {
      const regex = new RegExp(`^${allowedChars}*$`);
      if (!regex.test(pastedText)) {
        e.preventDefault();
        return;
      }
    }

    if (maxLength && pastedText.length > maxLength) {
      e.preventDefault();
      onChange(pastedText.slice(0, maxLength));
      return;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorAtStart = input.selectionStart === 0;
    const cursorAtEnd = input.selectionStart === value.length;
    const isEmpty = value.length === 0;

    if (e.key === 'Backspace' && isEmpty && onAutoRetreat) {
      e.preventDefault();
      onAutoRetreat();
      return;
    }

    if (e.key === 'ArrowLeft' && cursorAtStart && onAutoRetreat) {
      e.preventDefault();
      onAutoRetreat();
      return;
    }

    if (e.key === 'ArrowRight' && cursorAtEnd && onAutoAdvance) {
      e.preventDefault();
      onAutoAdvance();
      return;
    }

    onKeyDown?.(e);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
  };

  return (
    <input
      ref={segmentRef}
      type='text'
      value={value}
      onChange={handleChange}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      maxLength={maxLength}
      className={className}
      disabled={effectiveIsDisabled}
      style={dynamicWidth ? { width: `${dynamicWidth}ch` } : undefined}
      aria-label={
        ariaLabel ||
        `Coordinate segment ${segmentIndex !== undefined ? segmentIndex + 1 : ''}`
      }
      aria-disabled={effectiveIsDisabled}
      autoComplete='off'
      inputMode={
        allowedChars?.includes('0-9')
          ? allowedChars.includes('\\-\\.')
            ? 'decimal'
            : 'numeric'
          : 'text'
      }
    />
  );
}
