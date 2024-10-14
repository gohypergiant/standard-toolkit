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
import { isFiniteNumber, isFiniteNumeric, isNumber, isNumeric } from './';
import {
  floatingPointPairs,
  floatingPointStringPairs,
  nonFinitePairs,
  nonFiniteStringPairs,
  nonNumericPairs,
  numberLikeStringPairs,
  numberLiteralPairs,
} from './__fixtures__';

// NOTE: doing a bench() inside of the for/of loop causes heap allocation errors
describe('is-number: number literals', () => {
  bench('isFiniteNumber', () => {
    for (const pairs of numberLiteralPairs) {
      isFiniteNumber(pairs[1]);
    }
  });

  bench('isFiniteNumeric', () => {
    for (const pairs of numberLiteralPairs) {
      isFiniteNumeric(pairs[1]);
    }
  });

  bench('isNumber', () => {
    for (const pairs of numberLiteralPairs) {
      isNumber(pairs[1]);
    }
  });

  bench('isNumeric', () => {
    for (const pairs of numberLiteralPairs) {
      isNumeric(pairs[1]);
    }
  });
});

// --------------------------------------------------

describe('is-number: floating point literals', () => {
  bench('isFiniteNumber', () => {
    for (const pairs of floatingPointPairs) {
      isFiniteNumber(pairs[1]);
    }
  });

  bench('isFiniteNumeric', () => {
    for (const pairs of floatingPointPairs) {
      isFiniteNumeric(pairs[1]);
    }
  });

  bench('isNumber', () => {
    for (const pairs of floatingPointPairs) {
      isNumber(pairs[1]);
    }
  });

  bench('isNumeric', () => {
    for (const pairs of floatingPointPairs) {
      isNumeric(pairs[1]);
    }
  });
});

// --------------------------------------------------

describe('is-number: number like strings', () => {
  bench('isFiniteNumber', () => {
    for (const pairs of numberLikeStringPairs) {
      isFiniteNumber(pairs[1]);
    }
  });

  bench('isFiniteNumeric', () => {
    for (const pairs of numberLikeStringPairs) {
      isFiniteNumeric(pairs[1]);
    }
  });

  bench('isNumber', () => {
    for (const pairs of numberLikeStringPairs) {
      isNumber(pairs[1]);
    }
  });

  bench('isNumeric', () => {
    for (const pairs of numberLikeStringPairs) {
      isNumeric(pairs[1]);
    }
  });
});

// --------------------------------------------------

describe('is-number: floating point like strings', () => {
  bench('isFiniteNumber', () => {
    for (const pairs of floatingPointStringPairs) {
      isFiniteNumber(pairs[1]);
    }
  });

  bench('isFiniteNumeric', () => {
    for (const pairs of floatingPointStringPairs) {
      isFiniteNumeric(pairs[1]);
    }
  });

  bench('isNumber', () => {
    for (const pairs of floatingPointStringPairs) {
      isNumber(pairs[1]);
    }
  });

  bench('isNumeric', () => {
    for (const pairs of floatingPointStringPairs) {
      isNumeric(pairs[1]);
    }
  });
});

// --------------------------------------------------

describe('is-number: non finite values', () => {
  bench('isFiniteNumber', () => {
    for (const pairs of nonFinitePairs) {
      isFiniteNumber(pairs[1]);
    }
  });

  bench('isFiniteNumeric', () => {
    for (const pairs of nonFinitePairs) {
      isFiniteNumeric(pairs[1]);
    }
  });

  bench('isNumber', () => {
    for (const pairs of nonFinitePairs) {
      isNumber(pairs[1]);
    }
  });

  bench('isNumeric', () => {
    for (const pairs of nonFinitePairs) {
      isNumeric(pairs[1]);
    }
  });
});

// --------------------------------------------------

describe('is-number: non finite string values', () => {
  bench('isFiniteNumber', () => {
    for (const pairs of nonFiniteStringPairs) {
      isFiniteNumber(pairs[1]);
    }
  });

  bench('isFiniteNumeric', () => {
    for (const pairs of nonFiniteStringPairs) {
      isFiniteNumeric(pairs[1]);
    }
  });

  bench('isNumber', () => {
    for (const pairs of nonFiniteStringPairs) {
      isNumber(pairs[1]);
    }
  });

  bench('isNumeric', () => {
    for (const pairs of nonFiniteStringPairs) {
      isNumeric(pairs[1]);
    }
  });
});

// --------------------------------------------------

describe('is-number: non numeric values', () => {
  bench('isFiniteNumber', () => {
    for (const pairs of nonNumericPairs) {
      isFiniteNumber(pairs[1]);
    }
  });

  bench('isFiniteNumeric', () => {
    for (const pairs of nonNumericPairs) {
      isFiniteNumeric(pairs[1]);
    }
  });

  bench('isNumber', () => {
    for (const pairs of nonNumericPairs) {
      isNumber(pairs[1]);
    }
  });

  bench('isNumeric', () => {
    for (const pairs of nonNumericPairs) {
      isNumeric(pairs[1]);
    }
  });
});
