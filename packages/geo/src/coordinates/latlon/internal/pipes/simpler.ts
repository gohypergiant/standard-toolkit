// __private-exports
/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import type { Tokens } from '../lexer';

/**
 * Create a simplified pattern string - numbers = 'N', bearings = 'B' - to
 * allow for simpler pattern matching.
 *
 * @param tokens - Array of coordinate tokens to simplify.
 * @returns Simplified pattern string where 'N' = number and 'B' = bearing.
 *
 * @example
 * simpler(['45', '30', 'N', '/', '122', '15', 'W']);
 * // 'NNBNNNB'
 *
 * @example
 * simpler(['45', 'N']);
 * // 'NB'
 *
 * @remarks
 * pure function
 */
export const simpler = (tokens: Tokens) =>
  tokens.map((t) => (/\d/.test(t) ? 'N' : 'B')).join('');
