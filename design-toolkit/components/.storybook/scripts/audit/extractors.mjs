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

import { extractObjectValue } from './ast-parsers.mjs';

/**
 * Extract imports from AST
 */
export function extractImports(ast) {
  if (ast.error) {
    return [];
  }

  return ast.program.body
    .filter((node) => node.type === 'ImportDeclaration')
    .map((node) => ({
      source: node.source.value,
      specifiers: node.specifiers.map((spec) => ({
        type: spec.type,
        imported: spec.imported?.name || spec.local.name,
        local: spec.local.name,
      })),
    }));
}

/**
 * Extract meta object configuration
 */
export function extractMeta(ast) {
  if (ast.error) {
    return null;
  }

  const metaDeclaration = ast.program.body.find(
    (node) =>
      node.type === 'VariableDeclaration' &&
      node.declarations?.[0]?.id?.name === 'meta',
  );

  if (!metaDeclaration) {
    return null;
  }

  const alias = metaDeclaration.declarations[0].init;
  let metaObject = null;

  switch (alias?.type) {
    case 'ObjectExpression':
      metaObject = alias;
      break;
    case 'TSSatisfiesExpression':
      metaObject = alias.expression;
      break;
    default:
      return null;
  }

  const properties = {};
  metaObject.properties.forEach((prop) => {
    if (prop.type === 'SpreadElement') {
      // Handle spread elements in parameters
      const spreadValue = extractObjectValue(prop);
      properties[`__spread_${Object.keys(properties).length}`] = spreadValue;
    } else if (prop.key?.name) {
      properties[prop.key.name] = extractObjectValue(prop.value);
    }
  });

  return properties;
}

/**
 * Extract exported stories from AST
 */
export function extractExportedStories(ast) {
  if (ast.error) {
    return [];
  }

  const exports = ast.program.body.filter(
    (node) =>
      node.type === 'ExportNamedDeclaration' ||
      (node.type === 'ExportDefaultDeclaration' &&
        node.declaration?.type === 'VariableDeclaration'),
  );

  const storyExports = [];

  exports.forEach((exportNode) => {
    if (exportNode.type === 'ExportNamedDeclaration') {
      // Handle variable declarations: export const Default = { ... }
      if (exportNode.declaration?.type === 'VariableDeclaration') {
        exportNode.declaration.declarations.forEach((declaration) => {
          if (declaration.id?.name && declaration.id.name !== 'meta') {
            storyExports.push(declaration.id.name);
          }
        });
      }
      // Handle export specifiers: export { Default, Primary }
      else if (exportNode.specifiers) {
        exportNode.specifiers.forEach((specifier) => {
          if (
            specifier.exported?.name &&
            specifier.exported.name !== 'default' &&
            specifier.exported.name !== 'meta'
          ) {
            storyExports.push(specifier.exported.name);
          }
        });
      }
    }
    // Handle default export with variable declaration
    else if (
      exportNode.type === 'ExportDefaultDeclaration' &&
      exportNode.declaration?.type === 'VariableDeclaration'
    ) {
      exportNode.declaration.declarations.forEach((declaration) => {
        if (declaration.id?.name && declaration.id.name !== 'meta') {
          storyExports.push(declaration.id.name);
        }
      });
    }
  });

  return storyExports;
}
