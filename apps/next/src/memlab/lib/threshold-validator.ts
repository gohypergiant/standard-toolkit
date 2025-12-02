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

import type { ComponentThreshold } from './types';

/**
 * Result of threshold validation
 */
export interface ThresholdValidationResult {
  /** Whether the threshold configuration is valid */
  valid: boolean;
  /** Error messages for invalid configuration */
  errors: string[];
  /** Warning messages for potentially problematic configuration */
  warnings: string[];
}

/**
 * Result from a field validation helper
 */
interface FieldValidationResult {
  errors: string[];
  warnings: string[];
}

/**
 * Options for numeric field validation
 */
interface NumericValidationOptions {
  fieldName: string;
  value: unknown;
  component: string;
  mustBeInteger?: boolean;
  warningMax?: number;
  warningMaxMessage?: string;
  warningMin?: number;
  warningMinMessage?: string;
}

/** Maximum reasonable value for maxLeakedObjects */
const MAX_LEAKED_OBJECTS_WARNING = 100;

/** Maximum reasonable value for maxRetainedSize (100MB) */
const MAX_RETAINED_SIZE_WARNING = 104_857_600;

/** Minimum reasonable value for maxRetainedSize (1KB) */
const MIN_RETAINED_SIZE_WARNING = 1024;

/**
 * Validate a numeric field with configurable options
 */
function validateNumericField(
  options: NumericValidationOptions,
): FieldValidationResult {
  const {
    fieldName,
    value,
    component,
    mustBeInteger,
    warningMax,
    warningMaxMessage,
    warningMin,
    warningMinMessage,
  } = options;
  const errors: string[] = [];
  const warnings: string[] = [];

  if (value === undefined) {
    return { errors, warnings };
  }

  if (typeof value !== 'number') {
    errors.push(`${component}: ${fieldName} must be a number`);
    return { errors, warnings };
  }

  if (!Number.isFinite(value)) {
    errors.push(`${component}: ${fieldName} must be a finite number`);
    return { errors, warnings };
  }

  if (value < 0) {
    errors.push(`${component}: ${fieldName} cannot be negative`);
    return { errors, warnings };
  }

  if (mustBeInteger && !Number.isInteger(value)) {
    warnings.push(
      `${component}: ${fieldName} should be an integer (got ${value})`,
    );
  }

  if (warningMax !== undefined && value > warningMax) {
    warnings.push(
      warningMaxMessage ??
        `${component}: ${fieldName} > ${warningMax} is unusually high`,
    );
  }

  if (warningMin !== undefined && value > 0 && value < warningMin) {
    warnings.push(
      warningMinMessage ??
        `${component}: ${fieldName} < ${warningMin} may be too strict`,
    );
  }

  return { errors, warnings };
}

/**
 * Validate maxLeakedObjects field
 */
function validateMaxLeakedObjects(
  component: string,
  value: unknown,
): FieldValidationResult {
  return validateNumericField({
    fieldName: 'maxLeakedObjects',
    value,
    component,
    mustBeInteger: true,
    warningMax: MAX_LEAKED_OBJECTS_WARNING,
    warningMaxMessage: `${component}: maxLeakedObjects > ${MAX_LEAKED_OBJECTS_WARNING} is unusually high`,
  });
}

/**
 * Validate maxRetainedSize field
 */
function validateMaxRetainedSize(
  component: string,
  value: unknown,
): FieldValidationResult {
  return validateNumericField({
    fieldName: 'maxRetainedSize',
    value,
    component,
    warningMax: MAX_RETAINED_SIZE_WARNING,
    warningMaxMessage: `${component}: maxRetainedSize > 100MB is unusually high`,
    warningMin: MIN_RETAINED_SIZE_WARNING,
    warningMinMessage: `${component}: maxRetainedSize < 1KB may be too strict`,
  });
}

/**
 * Validate optional string field
 */
function validateOptionalString(
  component: string,
  fieldName: string,
  value: unknown,
): FieldValidationResult {
  const warnings: string[] = [];

  if (value !== undefined && typeof value !== 'string') {
    warnings.push(`${component}: ${fieldName} should be a string`);
  }

  return { errors: [], warnings };
}

/**
 * Validate optional string array field
 */
function validateStringArray(
  component: string,
  fieldName: string,
  value: unknown,
): FieldValidationResult {
  const warnings: string[] = [];

  if (value === undefined) {
    return { errors: [], warnings };
  }

  if (!Array.isArray(value)) {
    warnings.push(`${component}: ${fieldName} should be an array`);
    return { errors: [], warnings };
  }

  if (!value.every((item) => typeof item === 'string')) {
    warnings.push(`${component}: ${fieldName} should contain only strings`);
  }

  return { errors: [], warnings };
}

/**
 * Validate a single component threshold configuration
 *
 * @param component - Component name for error messages
 * @param threshold - Threshold configuration to validate
 * @returns Validation result with errors and warnings
 */
export function validateComponentThreshold(
  component: string,
  threshold: unknown,
): ThresholdValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof threshold !== 'object' || threshold === null) {
    errors.push(`${component}: threshold config must be an object`);
    return { valid: false, errors, warnings };
  }

  const config = threshold as Partial<ComponentThreshold>;

  const validationResults = [
    validateMaxLeakedObjects(component, config.maxLeakedObjects),
    validateMaxRetainedSize(component, config.maxRetainedSize),
    validateOptionalString(component, 'notes', config.notes),
    validateStringArray(component, 'knownIssues', config.knownIssues),
  ];

  for (const result of validationResults) {
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a complete threshold configuration file
 *
 * @param thresholds - Parsed threshold configuration object
 * @returns Validation result with errors and warnings
 */
export function validateThresholds(
  thresholds: Record<string, unknown>,
): ThresholdValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for empty config
  if (Object.keys(thresholds).length === 0) {
    warnings.push('Threshold configuration is empty');
    return { valid: true, errors, warnings };
  }

  // Validate each component
  for (const [component, config] of Object.entries(thresholds)) {
    const result = validateComponentThreshold(component, config);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate and load thresholds from a JSON file
 *
 * @param content - JSON content string
 * @returns Validation result with parsed thresholds if valid
 */
export function validateThresholdJson(
  content: string,
): ThresholdValidationResult & {
  thresholds?: Record<string, ComponentThreshold>;
} {
  // Try to parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    return {
      valid: false,
      errors: [
        `Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`,
      ],
      warnings: [],
    };
  }

  // Check if it's an object
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {
      valid: false,
      errors: ['Threshold configuration must be an object'],
      warnings: [],
    };
  }

  // Validate the thresholds
  const result = validateThresholds(parsed as Record<string, unknown>);

  if (result.valid) {
    return {
      ...result,
      thresholds: parsed as Record<string, ComponentThreshold>,
    };
  }

  return result;
}

/**
 * Format validation result for console output
 */
export function formatValidationResult(
  result: ThresholdValidationResult,
): string {
  const lines: string[] = [];

  if (result.valid) {
    lines.push('✅ Threshold configuration is valid');
  } else {
    lines.push('❌ Threshold configuration has errors:');
  }

  if (result.errors.length > 0) {
    for (const error of result.errors) {
      lines.push(`   ❌ ${error}`);
    }
  }

  if (result.warnings.length > 0) {
    lines.push('');
    lines.push('⚠️ Warnings:');
    for (const warning of result.warnings) {
      lines.push(`   ⚠️ ${warning}`);
    }
  }

  return lines.join('\n');
}
