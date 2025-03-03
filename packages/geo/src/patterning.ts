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

/**
 * Create a "capturing" group with the pattern provided by all arguments
 * merged into a single regex.
 *
 * @remarks
 * pure function
 *
 * @example
 * capture(/a/, /b/, /c/) === /(abc)/
 */
export const capture = (...p: RegExp[]) =>
  new RegExp(`(${merge(...p).source})`);

/**
 * Create a pattern using a template string and dict(ionary) of terms.
 *
 * @param dict an object with keys/properties that are RegExp objects that will
 * be used in the template string
 * @param template the definition of the pattern to build using the dict(ionary)
 * patterns
 *
 * @remarks
 * pure function
 *
 * @example
 * fromTemplate({ a: /alpha/, b: /beta/, ' ': / / }, 'a b') === /^alpha beta$/
 *
 */
export const fromTemplate = (dict: Record<string, RegExp>, template: string) =>
  merge(
    /^/,
    ...(template.match(/(\s+)|([^\s]+)/g) ?? []).map(
      (t) => dict[t as keyof typeof dict] ?? new RegExp(`_MISS_${t}_MISS_`),
    ),
    /$/,
  );

/**
 * Create a "non-capturing" group with the pattern provided by all arguments
 * merged into a single regex.
 *
 * @remarks
 * pure function
 *
 * @example
 * capture(/a/, /b/, /c/) === /(?:abc)/
 */
export const group = (...p: RegExp[]) =>
  new RegExp(`(?:${merge(...p).source})`);

/**
 * Concatenate all of the provided patterns into a single pattern; each
 * subsequent argument is joined with the previous with no "qualifier" between
 * them.
 *
 * @remarks
 * pure function
 *
 * @example
 * merge(/a/, /b/, /c/) === /abc/
 */
export const merge = (...all: RegExp[]) =>
  all.reduce((acc, next) => new RegExp(acc?.source + next.source));

/**
 * Create an "optional" "non-capturing" group with the pattern provided by all
 * arguments merged into a single regex.
 *
 * @remarks
 * pure function
 *
 * @example
 * capture(/a/, /b/, /c/) === /(?:abc)?/
 */
export const optional = (...p: RegExp[]) =>
  new RegExp(`(?:${merge(...p).source})?`);
