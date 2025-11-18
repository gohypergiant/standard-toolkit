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
import {
  ddmSegmentConfigs,
  ddSegmentConfigs,
  dmsSegmentConfigs,
  EXPECTED_SEGMENT_COUNTS,
  getEditableSegmentCount,
  getFormatDescription,
  getSegmentConfigs,
  mgrsSegmentConfigs,
  utmSegmentConfigs,
} from './segment-configs';
import type { CoordinateSystem } from './types';

describe('Segment Configurations', () => {
  describe('DD (Decimal Degrees)', () => {
    it('should have correct segment count', () => {
      const editableCount = ddSegmentConfigs.filter(
        (c) => c.type !== 'literal',
      ).length;
      expect(editableCount).toBe(EXPECTED_SEGMENT_COUNTS.dd);
      expect(editableCount).toBe(2);
    });

    it('should have latitude and longitude segments', () => {
      const editable = ddSegmentConfigs.filter((c) => c.type !== 'literal');
      expect(editable).toHaveLength(2);
      expect(editable[0].type).toBe('numeric');
      expect(editable[1].type).toBe('numeric');
    });

    it('should have comma separator', () => {
      const literal = ddSegmentConfigs.find((c) => c.type === 'literal');
      expect(literal?.value).toBe(', ');
    });
  });

  describe('DDM (Degrees Decimal Minutes)', () => {
    it('should have correct segment count', () => {
      const editableCount = ddmSegmentConfigs.filter(
        (c) => c.type !== 'literal',
      ).length;
      expect(editableCount).toBe(EXPECTED_SEGMENT_COUNTS.ddm);
      expect(editableCount).toBe(6);
    });

    it('should have correct segment types', () => {
      const editable = ddmSegmentConfigs.filter((c) => c.type !== 'literal');
      expect(editable[0].type).toBe('numeric'); // lat degrees
      expect(editable[1].type).toBe('numeric'); // lat minutes
      expect(editable[2].type).toBe('directional'); // lat direction
      expect(editable[3].type).toBe('numeric'); // lon degrees
      expect(editable[4].type).toBe('numeric'); // lon minutes
      expect(editable[5].type).toBe('directional'); // lon direction
    });

    it('should have degree and minute symbols', () => {
      const literals = ddmSegmentConfigs.filter((c) => c.type === 'literal');
      const values = literals.map((l) => l.value);
      expect(values).toContain('° ');
      expect(values).toContain("' ");
    });
  });

  describe('DMS (Degrees Minutes Seconds)', () => {
    it('should have correct segment count', () => {
      const editableCount = dmsSegmentConfigs.filter(
        (c) => c.type !== 'literal',
      ).length;
      expect(editableCount).toBe(EXPECTED_SEGMENT_COUNTS.dms);
      expect(editableCount).toBe(8);
    });

    it('should have correct segment types', () => {
      const editable = dmsSegmentConfigs.filter((c) => c.type !== 'literal');
      expect(editable[0].type).toBe('numeric'); // lat degrees
      expect(editable[1].type).toBe('numeric'); // lat minutes
      expect(editable[2].type).toBe('numeric'); // lat seconds
      expect(editable[3].type).toBe('directional'); // lat direction
      expect(editable[4].type).toBe('numeric'); // lon degrees
      expect(editable[5].type).toBe('numeric'); // lon minutes
      expect(editable[6].type).toBe('numeric'); // lon seconds
      expect(editable[7].type).toBe('directional'); // lon direction
    });

    it('should have degree, minute, and second symbols', () => {
      const literals = dmsSegmentConfigs.filter((c) => c.type === 'literal');
      const values = literals.map((l) => l.value);
      expect(values).toContain('° ');
      expect(values).toContain("' ");
      expect(values).toContain('" ');
    });
  });

  describe('MGRS (Military Grid Reference System)', () => {
    it('should have correct segment count', () => {
      const editableCount = mgrsSegmentConfigs.filter(
        (c) => c.type !== 'literal',
      ).length;
      expect(editableCount).toBe(EXPECTED_SEGMENT_COUNTS.mgrs);
      expect(editableCount).toBe(5);
    });

    it('should have correct segment types', () => {
      const editable = mgrsSegmentConfigs.filter((c) => c.type !== 'literal');
      expect(editable[0].type).toBe('numeric'); // zone
      expect(editable[1].type).toBe('alphanumeric'); // band
      expect(editable[2].type).toBe('alphanumeric'); // grid 100km
      expect(editable[3].type).toBe('numeric'); // easting
      expect(editable[4].type).toBe('numeric'); // northing
    });

    it('should have space separators', () => {
      const literals = mgrsSegmentConfigs.filter((c) => c.type === 'literal');
      expect(literals).toHaveLength(3);
      literals.forEach((l) => {
        expect(l.value).toBe(' ');
      });
    });
  });

  describe('UTM (Universal Transverse Mercator)', () => {
    it('should have correct segment count', () => {
      const editableCount = utmSegmentConfigs.filter(
        (c) => c.type !== 'literal',
      ).length;
      expect(editableCount).toBe(EXPECTED_SEGMENT_COUNTS.utm);
      expect(editableCount).toBe(4);
    });

    it('should have correct segment types', () => {
      const editable = utmSegmentConfigs.filter((c) => c.type !== 'literal');
      expect(editable[0].type).toBe('numeric'); // zone
      expect(editable[1].type).toBe('directional'); // hemisphere
      expect(editable[2].type).toBe('numeric'); // easting
      expect(editable[3].type).toBe('numeric'); // northing
    });

    it('should have space separators', () => {
      const literals = utmSegmentConfigs.filter((c) => c.type === 'literal');
      expect(literals).toHaveLength(2);
      literals.forEach((l) => {
        expect(l.value).toBe(' ');
      });
    });
  });

  describe('getSegmentConfigs', () => {
    it('should return correct configs for each format', () => {
      expect(getSegmentConfigs('dd')).toBe(ddSegmentConfigs);
      expect(getSegmentConfigs('ddm')).toBe(ddmSegmentConfigs);
      expect(getSegmentConfigs('dms')).toBe(dmsSegmentConfigs);
      expect(getSegmentConfigs('mgrs')).toBe(mgrsSegmentConfigs);
      expect(getSegmentConfigs('utm')).toBe(utmSegmentConfigs);
    });

    it('should default to DD for unknown format', () => {
      expect(getSegmentConfigs('unknown' as CoordinateSystem)).toBe(
        ddSegmentConfigs,
      );
    });
  });

  describe('getEditableSegmentCount', () => {
    it('should return correct count for each format', () => {
      expect(getEditableSegmentCount('dd')).toBe(2);
      expect(getEditableSegmentCount('ddm')).toBe(6);
      expect(getEditableSegmentCount('dms')).toBe(8);
      expect(getEditableSegmentCount('mgrs')).toBe(5);
      expect(getEditableSegmentCount('utm')).toBe(4);
    });
  });

  describe('getFormatDescription', () => {
    it('should return descriptions for all formats', () => {
      expect(getFormatDescription('dd')).toContain('40.7128');
      expect(getFormatDescription('ddm')).toContain('40°');
      expect(getFormatDescription('dms')).toContain('40°');
      expect(getFormatDescription('mgrs')).toContain('18T');
      expect(getFormatDescription('utm')).toContain('18N');
    });

    it('should return empty string for unknown format', () => {
      expect(getFormatDescription('unknown' as CoordinateSystem)).toBe('');
    });
  });

  describe('Character validation patterns', () => {
    it('DD segments should allow numeric and decimal', () => {
      const editable = ddSegmentConfigs.filter((c) => c.type !== 'literal');
      editable.forEach((seg) => {
        expect(seg.allowedChars).toMatch(/0-9/);
        expect(seg.allowedChars).toMatch(/\\\./);
        expect(seg.allowedChars).toMatch(/\\-/);
      });
    });

    it('DDM/DMS degrees should be numeric only', () => {
      const ddmEditable = ddmSegmentConfigs.filter((c) => c.type !== 'literal');
      const ddmDegrees = [ddmEditable[0], ddmEditable[3]]; // lat_deg, lon_deg
      ddmDegrees.forEach((seg) => {
        expect(seg.allowedChars).toBe('[0-9]');
      });
    });

    it('Directional segments should allow correct letters', () => {
      // DDM latitude direction
      const ddmLatDir = ddmSegmentConfigs.filter(
        (c) => c.type === 'directional',
      )[0];
      expect(ddmLatDir.allowedChars).toBe('[NS]');

      // DDM longitude direction
      const ddmLonDir = ddmSegmentConfigs.filter(
        (c) => c.type === 'directional',
      )[1];
      expect(ddmLonDir.allowedChars).toBe('[EW]');
    });

    it('MGRS band should exclude I and O', () => {
      const band = mgrsSegmentConfigs[1];
      expect(band.allowedChars).toBe('[C-HJ-NP-X]');
    });

    it('MGRS grid should exclude I and O', () => {
      const mgrsEditable = mgrsSegmentConfigs.filter(
        (c) => c.type !== 'literal',
      );
      const grid = mgrsEditable[2]; // grid_100km
      expect(grid.allowedChars).toBe('[A-HJ-NP-Z]');
    });
  });

  describe('maxLength constraints', () => {
    it('DD latitude should allow up to 10 characters', () => {
      const lat = ddSegmentConfigs[0];
      expect(lat.maxLength).toBe(10); // -90.123456
    });

    it('DD longitude should allow up to 11 characters', () => {
      const lon = ddSegmentConfigs[2];
      expect(lon.maxLength).toBe(11); // -180.123456
    });

    it('DDM/DMS latitude degrees should be 2 digits', () => {
      expect(ddmSegmentConfigs[0].maxLength).toBe(2);
      expect(dmsSegmentConfigs[0].maxLength).toBe(2);
    });

    it('DDM/DMS longitude degrees should be 3 digits', () => {
      const ddmEditable = ddmSegmentConfigs.filter((c) => c.type !== 'literal');
      const dmsEditable = dmsSegmentConfigs.filter((c) => c.type !== 'literal');
      expect(ddmEditable[3].maxLength).toBe(3); // lon_deg
      expect(dmsEditable[4].maxLength).toBe(3); // lon_deg
    });

    it('MGRS zone should be 2 digits', () => {
      expect(mgrsSegmentConfigs[0].maxLength).toBe(2);
    });

    it('MGRS band should be 1 letter', () => {
      expect(mgrsSegmentConfigs[1].maxLength).toBe(1);
    });

    it('UTM easting should be 7 digits', () => {
      const utmEditable = utmSegmentConfigs.filter((c) => c.type !== 'literal');
      const easting = utmEditable[2]; // easting
      expect(easting.maxLength).toBe(7);
    });

    it('UTM northing should be 7 digits', () => {
      const utmEditable = utmSegmentConfigs.filter((c) => c.type !== 'literal');
      const northing = utmEditable[3]; // northing
      expect(northing.maxLength).toBe(7);
    });
  });
});
