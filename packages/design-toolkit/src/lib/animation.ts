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

/**
 * Animation constants derived from design tokens.
 * These values match the CSS custom properties defined in design-foundation.
 */

/** Animation duration in seconds for fast transitions (150ms) */
export const ANIMATION_DURATION_FAST = 0.15;

/** Animation duration in seconds for normal transitions (200ms) */
export const ANIMATION_DURATION_NORMAL = 0.2;

/** Animation duration in seconds for slow transitions (300ms) */
export const ANIMATION_DURATION_SLOW = 0.3;

/** Standard easing curve for most animations */
export const ANIMATION_EASING_STANDARD = [0.4, 0, 0.2, 1] as const;

/** Deceleration easing curve for exit animations */
export const ANIMATION_EASING_DECELERATE = [0, 0, 0.2, 1] as const;

/** Acceleration easing curve for entrance animations */
export const ANIMATION_EASING_ACCELERATE = [0.4, 0, 1, 1] as const;

/** Spring stiffness for spring-based animations */
export const ANIMATION_SPRING_STIFFNESS = 300;

/** Spring damping for spring-based animations */
export const ANIMATION_SPRING_DAMPING = 30;
