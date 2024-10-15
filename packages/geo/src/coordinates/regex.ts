// __private-exports

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

// biome-ignore lint/style/noUnusedTemplateLiteral: makes it easier for future modifications
export const SEPARATORS = `[\\s,\\/]*`;

/**
 * @see https://en.wikipedia.org/wiki/ISO_6709
 *
 * Matches common DD format for longitude values.
 *
 * NSEW ± DDD.D NSEW
 *
 * Five capture groups:
 * 1. Optional NSEW
 * 2. Optional +-
 * 3. Degrees
 * 4. Optional Decimals
 * 5. Optional NSEW
 *
 * @example
 * ```markdown
 * 75
 * 75.00417
 * 075.00417
 * -075.00417
 * -  075.00417
 * W075.00417
 * 075.00417W
 * W  075.00417
 * 075.00417  W
 * ```
 */
// biome-ignore lint/style/noUnusedTemplateLiteral: makes it easier for future modifications
export const DD_LON = `([NSEW]?)[\\s]*([-+]?)[\\s]*(\\d{1,3})(\\.\\d*)?[\\s°]*([NSEW]?)`;

/**
 * @see https://en.wikipedia.org/wiki/ISO_6709
 *
 * Matches common DD format for latitude values.
 *
 * NSEW ± DD.D NSEW
 *
 * Five capture groups:
 * 1. Optional NSEW
 * 2. Optional +-
 * 3. Degrees
 * 4. Optional Decimals
 * 5. Optional NSEW
 *
 * @example
 * ```markdown
 * 40
 * 40.20361
 * +40.20361
 * + 40.20361
 * N40.20361
 * 40.20361N
 * N 40.20361
 * 40.20361 N
 * ```
 */
// biome-ignore lint/style/noUnusedTemplateLiteral: makes it easier for future modifications
export const DD_LAT = `([NSEW]?)[\\s]*([-+]?)[\\s]*(\\d{1,2})(\\.\\d*)?[\\s°]*([NSEW]?)`;

/**
 * @see https://en.wikipedia.org/wiki/ISO_6709
 *
 * Matches common DMS format for longitude values.
 *
 * Supported delimiters are comma, colon, space, degree, single quote, double quote, and forward slash.
 *
 * NSEW ± DDD DD DD .D|DDD NSEW
 *
 * Seven capture groups:
 * 1. Optional NSEW
 * 2. Optional +-
 * 3. Degrees
 * 4. Minutes
 * 5. Seconds
 * 6. Optional decimal seconds or milliarcseconds
 * 7. Optional NSEW
 *
 * @example
 * ```markdown
 * 403456.45
 * 40 34 56.45
 * 40/34/56.45
 * 40:34:56.45
 * 40°34'56.45
 * 403456
 * 40°34'56"
 * +403456.45
 * W403456.45
 * 403456.45W
 * W 40 34 56.45
 * 40 34 56.45 W
 * ```
 */
export const DMS_LON = `([NSEW]?)[\\s]*([-+]?)[\\s]*(\\d{1,3})[\\s,:°'′"″\\/]*(\\d{2})[\\s,:°'′"″\\/]*(\\d{2})[\\s,:°'′"″\\/]*(\\.\\d*|\\d{3})?[\\s,:°'′"″\\/]*([NSEW]?)`;

/**
 * @see https://en.wikipedia.org/wiki/ISO_6709
 *
 * Matches common DMS format for latitude values.
 *
 * Supported delimiters are comma, colon, space, degree, single quote, double quote, and forward slash.
 *
 * NSEW ± DD DD DD .D|DDD NSEW
 *
 * Seven capture groups:
 * 1. Optional NSEW
 * 2. Optional +-
 * 3. Degrees
 * 4. Minutes
 * 5. Seconds
 * 6. Optional decimal seconds or milliarcseconds
 * 7. Optional NSEW
 *
 * @example
 * ```markdown
 * 403456.45
 * 40 34 56.45
 * 40/34/56.45
 * 40:34:56.45
 * 40°34'56.45
 * 403456
 * 40°34'56"
 * +403456.45
 * N403456.45
 * 403456.45N
 * N 40 34 56.45
 * 40 34 56.45 N
 * ```
 */
export const DMS_LAT = `([NSEW]?)[\\s]*([-+]?)[\\s]*(\\d{1,2})[\\s,:°'′"″\\/]*(\\d{2})[\\s,:°'′"″\\/]*(\\d{2})[\\s,:°'′"″\\/]*(\\.\\d*|\\d{3})?[\\s,:°'′"″\\/]*([NSEW]?)`;
