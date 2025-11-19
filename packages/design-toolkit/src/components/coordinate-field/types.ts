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

import type {
  Dispatch,
  KeyboardEvent,
  RefAttributes,
  SetStateAction,
} from 'react';
import type {
  TextFieldProps as AriaTextFieldProps,
  FieldErrorProps,
  LabelProps,
} from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
import type { CoordinateFieldStyles } from './styles';

/**
 * Supported coordinate systems for display and input
 */
export type CoordinateSystem = 'dd' | 'ddm' | 'dms' | 'mgrs' | 'utm';

/**
 * Short labels for coordinate formats (used in popover)
 */
export const COORDINATE_FORMAT_LABELS: Record<CoordinateSystem, string> = {
  dd: 'DD',
  ddm: 'DDM',
  dms: 'DMS',
  mgrs: 'MGRS',
  utm: 'UTM',
};

/**
 * Full names for coordinate formats (used in popover titles/descriptions)
 */
export const COORDINATE_FORMAT_NAMES: Record<CoordinateSystem, string> = {
  dd: 'Decimal Degrees',
  ddm: 'Degrees Decimal Minutes',
  dms: 'Degrees Minutes Seconds',
  mgrs: 'Military Grid Reference System',
  utm: 'Universal Transverse Mercator',
};

/**
 * All supported coordinate systems
 * Use this constant instead of hardcoding the array in multiple places
 */
export const COORDINATE_SYSTEMS: readonly CoordinateSystem[] = [
  'dd',
  'dms',
  'ddm',
  'mgrs',
  'utm',
] as const;

/**
 * Coordinate value in Decimal Degrees format (internal representation)
 * All coordinate values are normalized to this format internally
 */
export type CoordinateValue = {
  lat: number; // Latitude in decimal degrees (-90 to 90)
  lon: number; // Longitude in decimal degrees (-180 to 180)
};

/**
 * Types of segments in a coordinate input
 */
export type SegmentType =
  | 'numeric'
  | 'directional'
  | 'literal'
  | 'alphanumeric';

/**
 * Configuration for a single coordinate segment
 */
export type SegmentConfig = {
  type: SegmentType;
  /** Placeholder text shown when segment is empty */
  placeholder?: string;
  /** Maximum character length for the segment */
  maxLength?: number;
  /** Regex pattern for allowed characters */
  allowedChars?: string;
  /** Fixed value for literal segments (e.g., ", " or "º") */
  value?: string;
  /** Padding in CSS 'ch' units to add to the segment width (defaults to 0.5 if not specified) */
  pad?: number;
};

/**
 * Result of parsing a pasted coordinate string
 */
export type ParsedCoordinateMatch = {
  /** The coordinate system format that matched */
  format: CoordinateSystem;
  /** The coordinate value in DD format */
  value: CoordinateValue;
  /** Display string in the matched format */
  displayString: string;
};

/**
 * State shared with child components through context
 */
export type CoordinateFieldState = {
  segmentValues: string[];
  format: CoordinateFieldProps['format'];
  /**
   * Current coordinate value in DD format
   * - undefined: uncontrolled mode with no default value
   * - null: controlled mode with empty/invalid value
   * - CoordinateValue: valid coordinate
   */
  currentValue?: CoordinateValue | null;
  /** Validation errors from @accelint/geo */
  validationErrors: string[];
  isDisabled: boolean;
  isInvalid: boolean;
  isRequired: boolean;
  /** Size variant of the field */
  size: CoordinateFieldProps['size'];
  /** Function to register timeouts for cleanup on unmount */
  registerTimeout: (timeoutId: NodeJS.Timeout) => void;
};

/**
 * Props for the CoordinateSegment component
 */
export type CoordinateSegmentProps = {
  /** Current value of the segment */
  value: string;
  /** Callback when the segment value changes */
  onChange: (value: string) => void;
  /** Callback when the segment receives focus */
  onFocus?: () => void;
  /** Callback when the segment loses focus */
  onBlur?: () => void;
  /** Callback for keyboard events (used for navigation between segments) */
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  /** Placeholder text to display when segment is empty */
  placeholder?: string;
  /** Maximum character length for the segment */
  maxLength?: number;
  /** Custom className for styling */
  className?: string;
  /** Whether the segment is disabled */
  isDisabled?: boolean;
  /** Regex pattern for allowed characters (e.g., "[0-9\\-\\.]" for numeric, "[NSEW]" for directional) */
  allowedChars?: string;
  /** Ref to the input element for programmatic focus management */
  segmentRef?: React.RefObject<HTMLInputElement>;
  /** Index of this segment in the parent field (for accessibility) */
  segmentIndex?: number;
  /** Total number of segments (for accessibility) */
  totalSegments?: number;
  /** Callback to trigger auto-advance to next segment */
  onAutoAdvance?: () => void;
  /** Callback to trigger auto-retreat to previous segment */
  onAutoRetreat?: () => void;
  /** Padding in CSS 'ch' units to add to the segment width (defaults to 0.5 if not specified) */
  pad?: number;
  /** Semantic accessibility label for the segment (e.g., "Latitude degrees") */
  ariaLabel?: string;
};

/**
 * Props for the CoordinateField component
 *
 * Extends AriaTextFieldProps to inherit standard form field props (id, isDisabled, isRequired, etc.)
 */
export type CoordinateFieldProps = Omit<
  AriaTextFieldProps,
  | 'children'
  | 'className'
  | 'placeholder'
  | 'type'
  | 'pattern'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'name' // Not applicable to multi-segment fields
> &
  RefAttributes<HTMLDivElement> &
  VariantProps<typeof CoordinateFieldStyles> & {
    /**
     * Custom class names for component slots
     */
    classNames?: {
      field?: string;
      label?: LabelProps['className'];
      control?: string;
      input?: string;
      segment?: string;
      description?: string;
      error?: FieldErrorProps['className'];
      formatButton?: string;
    };

    /**
     * Label text displayed above the input (medium size only)
     */
    label?: string;

    /**
     * Helper text displayed below the input
     */
    description?: string;

    /**
     * Error message to display when the field is invalid
     */
    errorMessage?: string;

    /**
     * Display format for coordinate input
     * @default 'dd' (Decimal Degrees)
     */
    format?: CoordinateSystem;

    /**
     * Size variant of the field
     * @default 'medium'
     */
    size?: 'small' | 'medium';

    /**
     * Whether to show the format button for copying coordinates in different formats
     * @default true
     */
    showFormatButton?: boolean;

    /**
     * Controlled value in Decimal Degrees format
     * - undefined: uncontrolled mode
     * - null: controlled mode with no/invalid value
     * - CoordinateValue: controlled mode with valid value
     */
    value?: CoordinateValue | null;

    /**
     * Default uncontrolled value in Decimal Degrees format
     */
    defaultValue?: CoordinateValue;

    /**
     * Callback fired when the coordinate value changes
     * @param value - The new coordinate value in DD format, or null if invalid
     */
    onChange?:
      | Dispatch<SetStateAction<CoordinateValue | null>>
      | ((value: CoordinateValue | null) => void);

    /**
     * Callback fired when validation or paste errors occur
     * @param message - Error message ("Invalid coordinate value" for validation errors, "Invalid coordinate format" for paste errors)
     * @param context - Additional context about the error:
     *   - Validation errors: `{ errors: string[], format: string, segments: string[] }`
     *   - Paste errors: `{ pastedText: string }`
     */
    onError?: (message: string, context?: Record<string, unknown>) => void;
  };
