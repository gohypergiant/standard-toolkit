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

import { tv } from '@accelint/design-foundation/lib/utils';

/**
 * Default styling configuration for CoordinateField
 */
export const CoordinateFieldStylesDefaults = {} as const;

/**
 * Tailwind Variants styling for CoordinateField component
 *
 * Slots:
 * - field: Root container
 * - label: Label text (medium size only)
 * - control: Input control container (icon + input + format button)
 * - input: Input area containing segments
 * - segment: Individual editable segment (coordinates parts)
 * - description: Helper text below input
 * - error: Error message text
 * - formatButton: Format conversion button
 */
export const CoordinateFieldStyles = tv({
  slots: {
    // field: 'group/coordinate-field flex flex-col gap-xs',
    // label: '',
    // control: [
    // 'flex w-fit items-center gap-m rounded-medium px-s py-xs font-display outline outline-interactive',
    // 'group-size-medium/coordinate-field:text-body-m',
    // 'group-size-small/coordinate-field:text-body-s',
    // 'fg-primary-bold',
    // 'hover:outline-interactive-hover',
    // 'group-invalid/coordinate-field:outline-serious-bold',
    // 'group-disabled/coordinate-field:placeholder:fg-disabled group-disabled/coordinate-field:fg-disabled group-disabled/coordinate-field:outline-interactive-disabled',
    // ],
    // input: '',
    // segment: [
    // 'text-right',
    // 'placeholder-shown:fg-primary-muted',
    // 'outline-none',
    // 'focus-visible:fg-a11y-on-accent focus-visible:bg-accent-primary-bold',
    // 'selection:fg-a11y-on-accent selection:bg-accent-primary-bold',
    // 'flex-shrink-0', // Prevent segments from shrinking below their calculated ch-based width
    // 'transition-[width]',
    // 'duration-150',
    // 'ease-in-out',
    // ],
    // description:
    // 'fg-primary-muted group-disabled/coordinate-field:fg-disabled text-body-xs',
    // error: 'fg-serious-bold text-body-xs',
    // popoverContent:
    //   '!max-h-[300px] rounded-medium bg-surface-overlay p-0 shadow-lg outline outline-static',
    // popoverHeader: 'fg-primary-muted p-s text-header-s',
    // popoverBody: 'flex flex-col p-s',
    // formatRow: 'flex items-start justify-between gap-s px-xs py-s',
    // formatLabel: 'fg-primary-bold text-body-s',
    // formatValue: 'fg-primary-muted truncate font-display text-body-s',
    // modalTitle: 'fg-primary-bold mb-s font-bold text-heading-s',
    // modalDescription: 'fg-primary-muted mb-m text-body-s',
    // formatOptions: 'mb-m flex flex-col gap-xs',
    // formatOptionContent: 'flex flex-1 flex-col gap-2xs',
    // formatOptionLabel: 'fg-primary-bold font-bold text-body-s',
    // formatOptionValue: 'fg-primary-muted break-all font-mono text-body-xs',
    // modalActions: 'flex justify-end gap-s',
  },
  variants: {},
  defaultVariants: CoordinateFieldStylesDefaults,
});
