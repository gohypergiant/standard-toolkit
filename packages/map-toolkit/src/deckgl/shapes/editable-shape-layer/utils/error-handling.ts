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

'use client';

import { Broadcast } from '@accelint/bus';
import { getSafeEnumValues } from '@accelint/core';
import { ShapeEvents } from '../../shared/events';
import type { SafeEnum } from '@accelint/core';
import type { ShapeValidationErrorEvent } from '../../shared/events';

/**
 * Shape error types
 */
export const ShapeErrorType = Object.freeze({
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  GEOMETRY_ERROR: 'GEOMETRY_ERROR',
  SAVE_ERROR: 'SAVE_ERROR',
  LOAD_ERROR: 'LOAD_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const);

export type ShapeErrorType = SafeEnum<typeof ShapeErrorType>;

/**
 * Structured shape error
 */
export interface ShapeError {
  type: ShapeErrorType;
  message: string;
  context?: string;
  originalError?: unknown;
  timestamp: number;
}

/**
 * Shape event bus instance
 */
const shapeBus = Broadcast.getInstance<ShapeValidationErrorEvent>();

/**
 * All valid shape error type values
 */
const SHAPE_ERROR_TYPES = getSafeEnumValues(ShapeErrorType);

/**
 * Keyword-to-error-type mapping for automatic error classification
 */
const ERROR_TYPE_KEYWORDS: ReadonlyMap<ShapeErrorType, readonly string[]> =
  new Map([
    [ShapeErrorType.VALIDATION_ERROR, ['validation', 'invalid', 'required']],
    [ShapeErrorType.GEOMETRY_ERROR, ['geometry', 'coordinates', 'polygon']],
    [ShapeErrorType.SAVE_ERROR, ['save', 'persist', 'write']],
    [ShapeErrorType.LOAD_ERROR, ['load', 'fetch', 'read']],
    [ShapeErrorType.PARSE_ERROR, ['parse', 'json', 'format']],
  ]);

/**
 * Check if a value is a valid ShapeErrorType
 */
export function isShapeErrorType(value: unknown): value is ShapeErrorType {
  return SHAPE_ERROR_TYPES.includes(value as ShapeErrorType);
}

/**
 * Determine error type from error message using keyword matching
 */
function classifyErrorType(message: string): ShapeErrorType {
  const lowerMessage = message.toLowerCase();

  for (const [errorType, keywords] of ERROR_TYPE_KEYWORDS) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      return errorType;
    }
  }

  return ShapeErrorType.UNKNOWN_ERROR;
}

/**
 * Extract error message from various error types
 */
function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Handle shape errors with logging and event emission
 *
 * @param error The error that occurred
 * @param context Context information about where/when the error occurred
 * @param emitEvent Whether to emit a validation error event (default: true)
 * @returns Structured error object
 */
export function handleShapeError(
  error: unknown,
  context?: string,
  emitEvent = true,
): ShapeError {
  const message = extractErrorMessage(error);
  const type = classifyErrorType(message);

  const shapeError: ShapeError = {
    type,
    message,
    context,
    originalError: error,
    timestamp: Date.now(),
  };

  // Log to console
  console.error('[Shapes Error]', {
    type: shapeError.type,
    message: shapeError.message,
    context: shapeError.context,
    error: shapeError.originalError,
  });

  // Emit event for consumer to handle (e.g., integrate with NoticeList)
  if (emitEvent && type === ShapeErrorType.VALIDATION_ERROR) {
    try {
      shapeBus.emit(ShapeEvents.validationError, {
        errors: [message],
      });
    } catch (emitError) {
      console.error(
        '[Shapes Error] Failed to emit validation error event:',
        emitError,
      );
    }
  }

  return shapeError;
}

/**
 * Safe execution wrapper with error handling
 *
 * @param operation The operation to execute
 * @param context Context information
 * @returns Result object with success/error status
 */
export async function safeExecute<T>(
  operation: () => T | Promise<T>,
  context?: string,
): Promise<
  { success: true; result: T } | { success: false; error: ShapeError }
> {
  try {
    const result = await operation();
    return { success: true, result };
  } catch (error) {
    const shapeError = handleShapeError(error, context);
    return { success: false, error: shapeError };
  }
}

/**
 * Emit validation errors to the event bus
 *
 * @param errors Array of error messages
 * @param warnings Optional array of warning messages or callback function
 */
export function emitValidationErrors(
  errors: string[],
  warnings?: string[] | ((errors: string[]) => void),
): void {
  // If warnings is a callback function, call it
  if (typeof warnings === 'function') {
    warnings(errors);
  }

  try {
    shapeBus.emit(ShapeEvents.validationError, {
      errors,
      warnings: Array.isArray(warnings) ? warnings : undefined,
    });
  } catch (error) {
    console.error('[Shapes Error] Failed to emit validation errors:', error);
  }
}

/**
 * Create a validation error
 */
export function createValidationError(
  message: string,
  context?: string,
): ShapeError {
  return {
    type: ShapeErrorType.VALIDATION_ERROR,
    message,
    context,
    timestamp: Date.now(),
  };
}

/**
 * Create a geometry error
 */
export function createGeometryError(
  message: string,
  context?: string,
): ShapeError {
  return {
    type: ShapeErrorType.GEOMETRY_ERROR,
    message,
    context,
    timestamp: Date.now(),
  };
}
