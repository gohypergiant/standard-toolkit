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

import { default as babelParser } from '@babel/parser';
import { fs } from 'zx';
import { babelOptions } from './config.mjs';

/**
 * Parse TypeScript/JSX file with Babel
 *
 * @param {string} filePath
 * @returns {babelParser.ParseResult<File>}
 */
export function parseFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    return babelParser.parse(content, babelOptions);
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Extract object value from AST node
 */
export function extractObjectValue(node) {
  if (!node) {
    return undefined;
  }

  switch (node.type) {
    case 'StringLiteral':
      return node.value;
    case 'BooleanLiteral':
      return node.value;
    case 'NumericLiteral':
      return node.value;
    case 'NullLiteral':
      return null;
    case 'ObjectExpression': {
      const obj = {};
      node.properties.forEach((prop, index) => {
        if (prop.type === 'SpreadElement') {
          obj[`__spread_${index}`] = extractObjectValue(prop);
        } else if (prop.key?.name) {
          obj[prop.key.name] = extractObjectValue(prop.value);
        }
      });
      return obj;
    }
    case 'ArrayExpression':
      return node.elements.map(extractObjectValue);
    case 'SpreadElement':
      return {
        type: 'spread',
        argument: extractObjectValue(node.argument),
      };
    case 'CallExpression':
      return {
        type: 'function_call',
        name: node.callee?.name || 'unknown',
        arguments: node.arguments?.map(extractObjectValue) || [],
      };
    case 'Identifier':
      return {
        type: 'identifier',
        name: node.name,
      };
    default:
      return {
        type: node.type,
        value: 'unparsed',
      };
  }
}
