// __private-exports
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

const DEFAULT_EMPTY_RANGE = 0;
const DEFAULT_MIN_RANGE = 1;
const DEFAULT_MAX_RANGE = 5;
const DEFAULT_MID_RANGE = 2;
const DEFAULT_UPPER_MID = 4;

export function range(start: number, end: number) {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => index + start);
}

// Handles edge cases around the relationship between pageCount and currentPage.`
export function isNavigationDisabled(
  pageCount: number,
  currentPage: number,
): boolean {
  return (
    !pageCount || pageCount < 1 || currentPage < 1 || pageCount < currentPage
  );
}

/**
 * Return min max range for visible pages. As per our design, we limit
 * the range of numbers to a spread of 5 maximum, getting the lower and upper bounds.
 *
 * @param pageCount - total page count
 * @param currentPage - current page
 * @returns - Range of 1 to 5 numbers.
 */
export function getPaginationRange(pageCount: number, currentPage: number) {
  if (
    !(pageCount && currentPage) ||
    currentPage > pageCount ||
    pageCount < 1 ||
    currentPage < 1
  ) {
    return { minRange: DEFAULT_EMPTY_RANGE, maxRange: DEFAULT_EMPTY_RANGE };
  }

  // Below max display.
  if (pageCount < DEFAULT_MAX_RANGE) {
    return {
      minRange: DEFAULT_MIN_RANGE,
      maxRange: pageCount,
    };
  }

  // Middle.
  if (currentPage >= 3 && currentPage < pageCount - 2) {
    return {
      minRange: currentPage - DEFAULT_MID_RANGE,
      maxRange: currentPage + DEFAULT_MID_RANGE,
    };
  }

  // End of page count.
  if (currentPage > pageCount - 3) {
    return {
      minRange: pageCount - DEFAULT_UPPER_MID,
      maxRange: pageCount,
    };
  }

  return { minRange: DEFAULT_MIN_RANGE, maxRange: DEFAULT_MAX_RANGE };
}
