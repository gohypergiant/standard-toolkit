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

import { z } from 'zod';

/**
 * Supported data formats for layer datasets.
 */
const layerDataTypeSchema = z.enum(['GEOJSON', 'ARROW', 'Unknown']);
/**
 * Service protocols supported for dataset integration.
 */
const layerServiceTypeSchema = z.enum(['VTS', 'WMS', 'WFS', 'FS', 'Unknown']);

/**
 * Data type specification for proper handling and validation.
 */
const layerDatasetFieldTypeSchema = z.enum([
  'bool',
  'date',
  'datetime',
  'f32',
  'f64',
  'i32',
  'i64',
  'linestring',
  'multilinestring',
  'multipoint',
  'multipolygon',
  'point',
  'polygon',
  'str',
  'time',
]);

/**
 * Built-in layer types for Deck.gl visualization layers.
 */
const layerConfigTypeSchema = z.union([
  z.enum(['icon', 'point', 'path', 'polygon', 'raster']),
  // NOTE: For custom, extended layer types
  z.string(),
]);

/**
 * Configuration for a single field within a dataset schema.
 */
const layerDatasetFieldSchema = z.object({
  id: z.string(),
  visible: z.boolean(),
  nullable: z.boolean(),
  type: layerDatasetFieldTypeSchema,
  label: z.string(),
  availableValues: z
    .array(
      z.object({
        name: z.string(),
        label: z.string(),
      }),
    )
    .optional(),
});

/**
 * Service integration and rendering metadata for datasets.
 */
const layerDatasetMetadataSchema = z.object({
  table: z.string(),
  serviceUrls: z.array(z.string()).optional(),
  serviceVersion: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Invalid version: must be x.y.z')
    .optional(),
  serviceLayer: z.string().optional(),
  idProperty: z.string().optional(),
  geometryProperty: z.string(),
  minZoom: z.number().optional(),
  maxZoom: z.number().optional(),
  positionFormat: z.enum(['XYZ', 'XY']).optional(),
  maxRequests: z.number().optional(),
  refetchInterval: z.number().optional(),
  defaultFields: z.array(z.string()),
  batchSize: z.number().optional(),
  filterDialect: z.enum(['cql', 'gml']).optional(),
});

/**
 * Complete dataset configuration combining service integration and data specification.
 *
 * @remarks
 * Provides a unified interface for all dataset types regardless of service or data format.
 * The discriminated union pattern enables type-safe handling of different combinations.
 *
 * @example
 * ```typescript
 * const validateDataset = validate(anyDatasetSchema);
 * ```
 */
export const anyDatasetSchema = z.object({
  id: z.string(),
  level: z.enum(['generated', 'user']),
  visible: z.boolean(),
  mutatable: z.boolean(),
  name: z.string(),
  description: z.string(),
  serviceType: layerServiceTypeSchema,
  dataType: layerDataTypeSchema,
  presentationTypes: z.record(
    z.string(),
    z.array(layerConfigTypeSchema).nullable(),
  ),
  fields: z.array(layerDatasetFieldSchema),
  metadata: layerDatasetMetadataSchema,
});

/**
 * Curried validation function for any Zod schema with consistent error handling.
 *
 * @template T - The expected output type after successful validation
 * @param schema - Zod schema to validate against
 * @returns Function that accepts data and returns validated result
 * @throws {Error} Validation error with formatted path and message details (from returned function)
 *
 * @remarks
 * Curried design enables partial application for reusable validators.
 * Provides consistent error formatting across all validation operations.
 * Error messages include full property paths for easy debugging.
 *
 * @example
 * ```typescript
 * // Create reusable validators
 * const validateDataset = validate(anyDatasetSchema);
 *
 * // Use validators multiple times
 * const dataset1 = validateDataset(rawConfig1);
 * const dataset2 = validateDataset(rawConfig2);
 *
 * // One-shot validation (non-curried usage)
 * const config = validate(configSchema)(rawConfig);
 * ```
 */
export function validateSchema<T>(schema: z.ZodType<T>): (data: unknown) => T {
  return (data: unknown): T => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues
          .map((err) => {
            const path = err.path.join('.');

            return path ? `${path}: ${err.message}` : err.message;
          })
          .join('\n');

        throw new Error(`Validation failed:\n${formattedErrors}`);
      }

      throw error;
    }
  };
}

/**
 * Pre-configured validator for dataset configurations.
 *
 * @throws {Error} Validation error with formatted path and message details (from returned function)
 *
 * @remarks
 * Convenience export that pre-applies the anyDatasetSchema to the validate function.
 *
 * @example
 * ```typescript
 * const dataset = validateDatasetConfig(rawDataset);
 * ```
 */
export const validateDatasetConfig = validateSchema(anyDatasetSchema);
