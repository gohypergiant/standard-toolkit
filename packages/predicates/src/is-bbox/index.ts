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

import { isFiniteNumber } from '../is-number';

/**
 * Determines if the given value is a valid bounding box.
 * Does not currently validate the lon/lat pairs.
 *
 * @param bbox - The value to check whether or not it is a bbox.
 */
export function isBbox(bbox: unknown) {
  if (!bbox) {
    return false;
  }

  if (!Array.isArray(bbox)) {
    return false;
  }

  if (bbox.length !== 4) {
    return false;
  }

  // TODO: do we want to validate against longitude/latitude ranges?

  return bbox.every(isFiniteNumber);
}
