/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// CSS rgba regex patterns - support both legacy and modern syntax

// Legacy comma-separated: rgb(255, 128, 64) or rgba(255, 128, 64, 0.5)
// Supports integers and percentages for both RGB and alpha
export const CSS_RGBA_LEGACY_REGEX =
  /^rgba?\(\s*(\d+(?:\.\d+)?%?)\s*,\s*(\d+(?:\.\d+)?%?)\s*,\s*(\d+(?:\.\d+)?%?)\s*(?:,\s*(\d+(?:\.\d+)?%?)\s*)?\)$/;

// Modern space-separated: rgb(255 128 64) or rgb(255 128 64 / 0.5)
// Supports integers and percentages for both RGB and alpha
export const CSS_RGBA_MODERN_REGEX =
  /^rgba?\(\s*(\d+(?:\.\d+)?%?)\s+(\d+(?:\.\d+)?%?)\s+(\d+(?:\.\d+)?%?)\s*(?:\/\s*(\d+(?:\.\d+)?%?)\s*)?\)$/;

// Hex color regex - matches #RGB, #RGBA, #RRGGBB, #RRGGBBAA (with or without #)
export const HEX_REGEX =
  /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
