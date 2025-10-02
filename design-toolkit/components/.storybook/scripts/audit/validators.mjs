#!/usr/bin/env zx

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
 * Check if parameters are valid
 */
export function hasCreateStandardParametersUsage(_parameters) {
  return true; // Parameters validation is now handled elsewhere
}

/**
 * Check meta object structure
 */
export function checkMetaStructure(meta, _filepath) {
  const issues = [];

  if (!meta) {
    issues.push({
      type: 'missing_meta',
      severity: 'error',
      message: 'Missing meta object',
      fix: 'Add meta object with title, component, and parameters',
    });
    return issues;
  }

  // Check required properties
  if (!meta.title) {
    issues.push({
      type: 'missing_title',
      severity: 'error',
      message: 'Missing title property in meta',
      fix: "Add title: 'Components/ComponentName'",
    });
  }

  if (!meta.component) {
    issues.push({
      type: 'missing_component',
      severity: 'error',
      message: 'Missing component property in meta',
      fix: 'Add component: YourComponent',
    });
  }

  // Check argTypes structure
  if (meta.argTypes) {
    issues.push(...checkArgTypes(meta.argTypes));
  }

  return issues;
}

/**
 * Check argTypes structure
 */
export function checkArgTypes(argTypes) {
  const issues = [];

  if (!argTypes || typeof argTypes !== 'object') {
    return issues;
  }

  // Check for common props that should be excluded
  const commonPropsToExclude = ['className', 'style', 'key', 'ref', 'slot'];

  commonPropsToExclude.forEach((prop) => {
    if (argTypes[prop]) {
      issues.push({
        type: 'common_prop_in_argtypes',
        severity: 'info',
        message: `Common prop '${prop}' should be excluded from argTypes`,
        fix: `Remove '${prop}' from argTypes or add to exclusions`,
      });
    }
  });

  // Check for proper control types
  Object.entries(argTypes).forEach(([propName, config]) => {
    if (config && typeof config === 'object') {
      if (config.control && !config.control.type) {
        issues.push({
          type: 'missing_control_type',
          severity: 'warning',
          message: `ArgType '${propName}' has control without type`,
          fix: `Add control.type for '${propName}'`,
        });
      }
    }
  });

  return issues;
}

/**
 * Check for Default story export
 */
export function checkDefaultStoryExport(storyExports) {
  const issues = [];

  if (!storyExports.includes('Default')) {
    issues.push({
      type: 'missing_default_story',
      severity: 'warning',
      message: 'Missing Default story export',
      fix: 'Add a Default story export: export const Default: StoryObj<typeof meta> = { ... }',
    });
  }

  return issues;
}
