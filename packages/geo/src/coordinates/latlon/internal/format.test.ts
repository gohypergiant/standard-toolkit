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

import { describe, expect, it } from 'vitest';
import { formatDecimalDegrees } from '../decimal-degrees/formatter';
import { formatDegreesDecimalMinutes } from '../degrees-decimal-minutes/formatter';
import { formatDegreesMinutesSeconds } from '../degrees-minutes-seconds/formatter';
import type { FormatOptions } from './format';

const defaultOptions: FormatOptions = {
  prefix: '',
  suffix: '',
  separator: ', ',
};

const withOrdinal = (overrides?: Partial<FormatOptions>): FormatOptions => ({
  ...defaultOptions,
  withOrdinal: true,
  ...overrides,
});

describe('formatDecimalDegrees', () => {
  it('should format positive coordinates correctly', () => {
    const result = formatDecimalDegrees([12.345678, 23.456789]);
    expect(result).toBe('12.345678°, 23.456789°');
  });

  it('should format negative coordinates correctly', () => {
    const result = formatDecimalDegrees([-12.345678, -23.456789]);
    expect(result).toBe('-12.345678°, -23.456789°');
  });

  it('should format mixed coordinates correctly', () => {
    const result = formatDecimalDegrees([-74.006, 40.7128]);
    expect(result).toBe('-74.006000°, 40.712800°');
  });

  it('should format zero coordinates correctly', () => {
    const result = formatDecimalDegrees([0, 0]);
    expect(result).toBe('0.000000°, 0.000000°');
  });

  it('should format coordinates with ordinals when specified', () => {
    const result = formatDecimalDegrees([12.345678, 23.456789], withOrdinal());
    expect(result).toBe('12.345678° N, 23.456789° E');
  });

  it('should format negative coordinates with ordinals correctly', () => {
    const result = formatDecimalDegrees(
      [-12.345678, -23.456789],
      withOrdinal(),
    );
    expect(result).toBe('-12.345678° S, -23.456789° W');
  });

  it('should use custom prefix, suffix, and separator', () => {
    const result = formatDecimalDegrees([12.345678, 23.456789], {
      prefix: '(',
      suffix: ')',
      separator: ' / ',
    });
    expect(result).toBe('(12.345678° / 23.456789°)');
  });

  it('should handle boundary coordinates', () => {
    const result = formatDecimalDegrees([180, 90], withOrdinal());
    expect(result).toBe('180.000000° N, 90.000000° E');

    const result2 = formatDecimalDegrees([-180, -90], withOrdinal());
    expect(result2).toBe('-180.000000° S, -90.000000° W');
  });
});

describe('formatDegreesDecimalMinutes', () => {
  it('should format positive coordinates correctly', () => {
    const result = formatDegreesDecimalMinutes([12.345678, 23.456789]);
    expect(result).toBe("12° 20.7407', 23° 27.4073'");
  });

  it('should format negative coordinates correctly', () => {
    const result = formatDegreesDecimalMinutes([-12.345678, -23.456789]);
    expect(result).toBe("12° 20.7407', 23° 27.4073'");
  });

  it('should format coordinates with exact half degrees', () => {
    const result = formatDegreesDecimalMinutes([12.5, 23.5]);
    expect(result).toBe("12° 30.0000', 23° 30.0000'");
  });

  it('should format coordinates with exact quarter degrees', () => {
    const result = formatDegreesDecimalMinutes([12.25, 23.75]);
    expect(result).toBe("12° 15.0000', 23° 45.0000'");
  });

  it('should format zero coordinates correctly', () => {
    const result = formatDegreesDecimalMinutes([0, 0]);
    expect(result).toBe("0° 0.0000', 0° 0.0000'");
  });

  it('should format coordinates with ordinals when specified', () => {
    const result = formatDegreesDecimalMinutes(
      [12.345678, 23.456789],
      withOrdinal(),
    );
    expect(result).toBe("12° 20.7407' N, 23° 27.4073' E");
  });

  it('should format negative coordinates with ordinals correctly', () => {
    const result = formatDegreesDecimalMinutes(
      [-12.345678, -23.456789],
      withOrdinal(),
    );
    expect(result).toBe("12° 20.7407' S, 23° 27.4073' W");
  });

  it('should use custom separator', () => {
    const result = formatDegreesDecimalMinutes([12.345678, 23.456789], {
      prefix: '',
      suffix: '',
      separator: ' / ',
    });
    expect(result).toBe("12° 20.7407' / 23° 27.4073'");
  });

  it('should handle boundary coordinates', () => {
    const result = formatDegreesDecimalMinutes([180, 90]);
    expect(result).toBe("180° 0.0000', 90° 0.0000'");

    const result2 = formatDegreesDecimalMinutes([-180, -90], withOrdinal());
    expect(result2).toBe("180° 0.0000' S, 90° 0.0000' W");
  });
});

describe('formatDegreesMinutesSeconds', () => {
  it('should format positive coordinates correctly', () => {
    const result = formatDegreesMinutesSeconds([12.345678, 23.456789]);
    expect(result).toBe("12° 20' 44.44″, 23° 27' 24.44″");
  });

  it('should format negative coordinates correctly', () => {
    const result = formatDegreesMinutesSeconds([-12.345678, -23.456789]);
    expect(result).toBe("12° 20' 44.44″, 23° 27' 24.44″");
  });

  it('should format coordinates with exact values', () => {
    const result = formatDegreesMinutesSeconds([12.5, 23.5]);
    expect(result).toBe("12° 30' 0.00″, 23° 30' 0.00″");
  });

  it('should format coordinates with quarter degrees', () => {
    const result = formatDegreesMinutesSeconds([12.25, 23.75]);
    expect(result).toBe("12° 15' 0.00″, 23° 45' 0.00″");
  });

  it('should format zero coordinates correctly', () => {
    const result = formatDegreesMinutesSeconds([0, 0]);
    expect(result).toBe("0° 0' 0.00″, 0° 0' 0.00″");
  });

  it('should format coordinates with ordinals when specified', () => {
    const result = formatDegreesMinutesSeconds(
      [12.345678, 23.456789],
      withOrdinal(),
    );
    expect(result).toBe("12° 20' 44.44″ N, 23° 27' 24.44″ E");
  });

  it('should format negative coordinates with ordinals correctly', () => {
    const result = formatDegreesMinutesSeconds(
      [-12.345678, -23.456789],
      withOrdinal(),
    );
    expect(result).toBe("12° 20' 44.44″ S, 23° 27' 24.44″ W");
  });

  it('should use custom separator', () => {
    const result = formatDegreesMinutesSeconds([12.345678, 23.456789], {
      prefix: '',
      suffix: '',
      separator: ' / ',
    });
    expect(result).toBe("12° 20' 44.44″ / 23° 27' 24.44″");
  });

  it('should handle boundary coordinates', () => {
    const result = formatDegreesMinutesSeconds([180, 90]);
    expect(result).toBe("180° 0' 0.00″, 90° 0' 0.00″");

    const result2 = formatDegreesMinutesSeconds([-180, -90], withOrdinal());
    expect(result2).toBe("180° 0' 0.00″ S, 90° 0' 0.00″ W");
  });

  it('should handle coordinates with fractional seconds', () => {
    // Coordinate that results in fractional seconds
    const result = formatDegreesMinutesSeconds([12.345679, 23.45679]);
    expect(result).toBe("12° 20' 44.44″, 23° 27' 24.44″");
  });
});

describe('formatter configuration options', () => {
  it('should handle all formatters with custom configuration', () => {
    const coordinates: [number, number] = [12.345678, 23.456789];
    const config: FormatOptions = {
      prefix: '[',
      suffix: ']',
      separator: ' | ',
      withOrdinal: true,
    };

    const ddResult = formatDecimalDegrees(coordinates, config);
    const ddmResult = formatDegreesDecimalMinutes(coordinates, config);
    const dmsResult = formatDegreesMinutesSeconds(coordinates, config);

    expect(ddResult).toBe('[12.345678° N | 23.456789° E]');
    expect(ddmResult).toBe("[12° 20.7407' N | 23° 27.4073' E]");
    expect(dmsResult).toBe("[12° 20' 44.44″ N | 23° 27' 24.44″ E]");
  });

  it('should handle formatters with default options', () => {
    const coordinates: [number, number] = [12.345678, 23.456789];

    const ddResult = formatDecimalDegrees(coordinates, defaultOptions);
    const ddmResult = formatDegreesDecimalMinutes(coordinates, defaultOptions);
    const dmsResult = formatDegreesMinutesSeconds(coordinates, defaultOptions);

    expect(ddResult).toBe('12.345678°, 23.456789°');
    expect(ddmResult).toBe("12° 20.7407', 23° 27.4073'");
    expect(dmsResult).toBe("12° 20' 44.44″, 23° 27' 24.44″");
  });

  it('should handle different separator configurations', () => {
    const coordinates: [number, number] = [12.345678, 23.456789];

    const result1 = formatDecimalDegrees(coordinates, {
      ...defaultOptions,
      separator: ' - ',
    });
    const result2 = formatDecimalDegrees(coordinates, {
      ...defaultOptions,
      prefix: '(',
    });
    const result3 = formatDecimalDegrees(coordinates, {
      ...defaultOptions,
      suffix: ')',
    });

    expect(result1).toBe('12.345678° - 23.456789°');
    expect(result2).toBe('(12.345678°, 23.456789°');
    expect(result3).toBe('12.345678°, 23.456789°)');
  });
});
