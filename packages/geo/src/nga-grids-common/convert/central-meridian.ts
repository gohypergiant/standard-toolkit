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

/**
 * Calculates the central meridian (in radians) for a given UTM zone.
 *
 * Each UTM zone is 6° wide. Zone 1 is centered at -177°, zone 2 at -171°, etc.
 * Formula: (zoneNumber - 1) × 6° - 180° + 3°
 *
 * @param zoneNumber - UTM zone number (1-60)
 * @returns Central meridian in radians
 *
 * @see NGA.SIG.0012_2.0.0_UTMUPS (2014) - Section 2.3
 * @see {@link file://./../../../agents.md} for AI generation prompts
 */
export function centralMeridian(zoneNumber: number): number {
  return ((zoneNumber - 1) * 6 - 180 + 3) * (Math.PI / 180);
}
