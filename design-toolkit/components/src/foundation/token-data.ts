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

// These tokens drive the storybook stories.
// future: generate these

export const tokens = {
  bg: {
    base: [
      'bg-surface-default',
      'bg-surface-raised',
      'bg-surface-overlay',
      'bg-surface-muted',
      'bg-interactive-bold',
      'bg-interactive-bold-hover',
      'bg-interactive-bold-pressed',
      'bg-interactive-muted',
      'bg-interactive-muted-hover',
      'bg-interactive-muted-pressed',
      'bg-interactive-disabled',
      'bg-accent-primary-bold',
      'bg-accent-primary-hover',
      'bg-accent-primary-pressed',
      'bg-accent-primary-muted',
    ],
    utility: [
      'bg-info-bold',
      'bg-info-hover',
      'bg-info-pressed',
      'bg-info-muted',
      'bg-advisory-bold',
      'bg-advisory-hover',
      'bg-advisory-pressed',
      'bg-advisory-muted',
      'bg-normal-bold',
      'bg-normal-hover',
      'bg-normal-pressed',
      'bg-normal-muted',
      'bg-serious-bold',
      'bg-serious-hover',
      'bg-serious-pressed',
      'bg-serious-muted',
      'bg-critical-bold',
      'bg-critical-hover',
      'bg-critical-pressed',
      'bg-critical-muted',
    ],
  },
  fg: {
    base: [
      'fg-primary-bold',
      'fg-primary-muted',
      'fg-inverse-bold',
      'fg-inverse-muted',
      'fg-disabled',
      'fg-pressed',
      'fg-hover',
    ],
    utility: [
      'fg-accent-primary-bold',
      'fg-accent-primary-hover',
      'fg-accent-primary-pressed',
      'fg-info-bold',
      'fg-info-hover',
      'fg-info-pressed',
      'fg-advisory-bold',
      'fg-advisory-hover',
      'fg-advisory-pressed',
      'fg-normal-bold',
      'fg-normal-hover',
      'fg-normal-pressed',
      'fg-serious-bold',
      'fg-serious-hover',
      'fg-serious-pressed',
      'fg-critical-bold',
      'fg-critical-hover',
      'fg-critical-pressed',
    ],
    a11y: ['fg-a11y-on-accent', 'fg-a11y-on-utility'],
  },
  outline: {
    base: [
      'outline-static',
      'outline-interactive',
      'outline-interactive-hover',
      'outline-interactive-pressed',
      'outline-interactive-disabled',
      'outline-accent-primary-bold',
      'outline-accent-primary-hover',
      'outline-accent-primary-pressed',
    ],
    utility: [
      'outline-info-bold',
      'outline-info-hover',
      'outline-info-pressed',
      'outline-advisory-bold',
      'outline-advisory-hover',
      'outline-advisory-pressed',
      'outline-normal-bold',
      'outline-normal-hover',
      'outline-normal-pressed',
      'outline-mono-bold',
      'outline-mono-hover',
      'outline-mono-pressed',
      'outline-serious-bold',
      'outline-serious-hover',
      'outline-serious-pressed',
      'outline-critical-bold',
      'outline-critical-hover',
      'outline-critical-pressed',
    ],
  },
};
