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

import { bench, describe } from 'vitest';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Callable = (...a: any[]) => any;

const TEST_VALUES = [
  1,
  0,
  '1',
  '0',
  'on',
  'off',
  'true',
  'false',
  'yes',
  true,
  false,
  'ON',
  'YES',
  'TRUE',
] as const;

const runTestValues = (fn: Callable) => TEST_VALUES.forEach(fn);

// NOTE: doing a bench() inside of the for/of loop causes heap allocation errors
describe('variations on isFalse|isNo|isOff|isOn|isTrue|isYes implementation', () => {
  /**/ // <--- remove space to disable block comment
  bench('original (regex) with setup', () => {
    const trueRegex = /^(?:y|yes|true|1|on)$/i;
    const falseRegex = /^(?:n|no|false|0|off)$/i;

    function isFalse(val: unknown) {
      const normalized = normalize(val);
      return falseRegex.test(normalized);
    }

    function isTrue(val: unknown) {
      const normalized = normalize(val);
      return trueRegex.test(normalized);
    }

    function normalize(val: unknown) {
      return `${val}`.trim();
    }

    runTestValues(isTrue);
    runTestValues(isFalse);
  });
  //*/

  /** / // <--- remove space to disable block comment
  (() => {
    // isolated scope
    const trueRegex = /^(?:y|yes|true|1|on)$/i;
    const falseRegex = /^(?:n|no|false|0|off)$/i;

    function isFalse(val: unknown) {
      const normalized = normalize(val);
      return falseRegex.test(normalized);
    }

    function isTrue(val: unknown) {
      const normalized = normalize(val);
      return trueRegex.test(normalized);
    }

    function normalize(val: unknown) {
      return `${val}`.trim();
    }

    bench('original (regex) without setup', () => {
      runTestValues(isTrue);
      runTestValues(isFalse);
    });
  })();
  //*/

  /**/
  bench('[altered] original (regex) with setup', () => {
    const trueRegex = /^(?:y|yes|true|1|on)$/i;
    const falseRegex = /^(?:n|no|false|0|off)$/i;

    const test = (regex: RegExp, val: unknown) => regex.test(`${val}`.trim());

    const isFalse = (val: unknown) => test(falseRegex, val);
    const isTrue = (val: unknown) => test(trueRegex, val);

    runTestValues(isTrue);
    runTestValues(isFalse);
  });
  //*/

  /** / // <--- remove space to disable block comment
  (() => {
    // isolated scope
    const trueRegex = /^(?:y|yes|true|1|on)$/i;
    const falseRegex = /^(?:n|no|false|0|off)$/i;

    const test = (regex: RegExp, val: unknown) => regex.test(`${val}`.trim());

    const isFalse = (val: unknown) => test(falseRegex, val);
    const isTrue = (val: unknown) => test(trueRegex, val);

    bench('[altered] original (regex) without setup', () => {
      runTestValues(isTrue);
      runTestValues(isFalse);
    });
  })();
  //*/

  /**/
  bench('array lookup with setup', () => {
    const falseValues = ['0', 'false', 'n', 'no', 'off'];
    const trueValues = ['1', 'true', 'y', 'yes', 'on'];

    const test = (list: string[], val: unknown) =>
      list.includes(`${val}`.trim().toLowerCase());

    const isFalse = (val: unknown) => test(falseValues, val);
    const isTrue = (val: unknown) => test(trueValues, val);

    runTestValues(isTrue);
    runTestValues(isFalse);
  });

  /** / // <--- remove space to disable block comment
  (() => {
    const falseValues = ['0', 'false', 'n', 'no', 'off'];
    const trueValues = ['1', 'true', 'y', 'yes', 'on'];

    const test = (list: string[], val: unknown) =>
      list.includes(`${val}`.trim().toLowerCase());

    const isFalse = (val: unknown) => test(falseValues, val);
    const isTrue = (val: unknown) => test(trueValues, val);

    bench('array lookup without setup', () => {
      runTestValues(isTrue);
      runTestValues(isFalse);
    });
  })();
  //*/

  /**/ // <--- remove space to disable block comment
  bench('cached lowercase literal values with setup', () => {
    const cachedValues = {
      0: false,
      false: false,
      n: false,
      no: false,
      off: false,

      1: true,
      true: true,
      on: true,
      y: true,
    } as const;

    const normal = (val: unknown) => `${val}`.trim().toLowerCase();

    const isFalse = (val: unknown) => cachedValues[normal(val)] === false;
    const isTrue = (val: unknown) => cachedValues[normal(val)] === true;

    runTestValues(isTrue);
    runTestValues(isFalse);
  });
  //*/

  /** / // <--- remove space to disable block comment
  (() => {
    const cachedValues = {
      0: false,
      false: false,
      n: false,
      no: false,
      off: false,

      1: true,
      true: true,
      on: true,
      y: true,
    } as const;

    const normal = (val: unknown) => `${val}`.trim().toLowerCase();

    const isFalse = (val: unknown) => cachedValues[normal(val)] === false;
    const isTrue = (val: unknown) => cachedValues[normal(val)] === true;

    bench('cached lowercase literal values without setup', () => {
      runTestValues(isTrue);
      runTestValues(isFalse);
    });
  })();
  //*/

  // ---------------------------------------------------------------------------
  // This option - explicit literal values - is the fastest but not the greatest
  // for maintenance; for raw speed this is definitely the fastest.
  // ---------------------------------------------------------------------------

  /**/ // <--- remove space to disable block comment
  bench('explicit literal values with setup', () => {
    const cachedValues = {
      0: false,
      false: false,
      n: false,
      N: false,
      no: false,
      NO: false,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      No: false,
      nO: false,
      off: false,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      Off: false,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      OFf: false,
      OFF: false,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      oFF: false,
      ofF: false,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      OfF: false,
      oFf: false,

      1: true,
      true: true,
      on: true,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      On: true,
      ON: true,
      oN: true,
      y: true,
      Y: true,
      yes: true,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      Yes: true,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      YEs: true,
      YES: true,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      yES: true,
      yeS: true,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      YeS: true,
      yEs: true,
    } as const;

    const isFalse = (val: unknown) => cachedValues[`${val}`.trim()] === false;
    const isTrue = (val: unknown) => cachedValues[`${val}`.trim()] === true;

    runTestValues(isTrue);
    runTestValues(isFalse);
  });
  //*/

  /** / // <--- remove space to disable block comment
  (() => {
    const cachedValues = {
      0: false,
      false: false,
      n: false,
      N: false,
      no: false,
      NO: false,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      No: false,
      nO: false,
      off: false,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      Off: false,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      OFf: false,
      OFF: false,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      oFF: false,
      ofF: false,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      OfF: false,
      oFf: false,

      1: true,
      true: true,
      on: true,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      On: true,
      ON: true,
      oN: true,
      y: true,
      Y: true,
      yes: true,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      Yes: true,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      YEs: true,
      YES: true,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      yES: true,
      yeS: true,
      // biome-ignore lint/style/useNamingConvention: <explanation>
      YeS: true,
      yEs: true,
    } as const;

    const isFalse = (val: unknown) => cachedValues[`${val}`.trim()] === false;
    const isTrue = (val: unknown) => cachedValues[`${val}`.trim()] === true;

    bench('explicit literal values without setup', () => {
      runTestValues(isTrue);
      runTestValues(isFalse);
    });
  })();
  //*/
});
