/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { violation } from './violation';

const LAT_LIMIT = 90;
const LON_LIMIT = 180;

export function isFiniteNumber(value: number): boolean {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Validates that a value is within a signed range (-limit to +limit).
 * Returns an error message if invalid, undefined if valid.
 *
 * @param label - The label for error messages (used as-is for range errors,
 *                lowercased for "Invalid" errors)
 * @param value - The numeric value to validate
 * @param limit - The absolute limit (validates -limit to +limit)
 */
export function validateSignedRange(
  label: string,
  value: number,
  limit: number,
): string | undefined {
  if (!isFiniteNumber(value)) {
    return violation(
      `Invalid ${label.toLowerCase()} value (${value}); expected a finite number.`,
    );
  }

  if (value < -limit || value > limit) {
    return violation(
      `${label} value (${value}) is outside valid range (-${limit} to ${limit}).`,
    );
  }
}

export function validateNumericCoordinate(lat: number, lon: number): string[] {
  const errors: string[] = [];

  const latError = validateSignedRange('Latitude', lat, LAT_LIMIT);
  if (latError) {
    errors.push(latError);
  }

  const lonError = validateSignedRange('Longitude', lon, LON_LIMIT);
  if (lonError) {
    errors.push(lonError);
  }

  return errors;
}
