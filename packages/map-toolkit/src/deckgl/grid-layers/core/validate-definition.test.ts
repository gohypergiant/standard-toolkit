/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
import type { GridDefinition, GridRenderer } from './types.ts';
import { validateDefinition } from './validate-definition.ts';

// Minimal valid renderer stub
const validRenderer: GridRenderer = {
  render: () => ({ lines: [], labels: [] }),
};

// Minimal valid definition used as a base for negative tests
function makeValidDef(overrides: Partial<GridDefinition> = {}): GridDefinition {
  return {
    id: 'test-grid',
    name: 'Test Grid',
    zoomRanges: [{ type: 'COARSE', key: 'coarse', minZoom: 0, maxZoom: 5 }],
    defaultStyles: {
      COARSE: { lineColor: [255, 0, 0, 255], lineWidth: 2 },
    },
    renderer: validRenderer,
    ...overrides,
  };
}

describe('validateDefinition', () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it('should not throw for a fully valid definition', () => {
    expect(() => validateDefinition(makeValidDef())).not.toThrow();
  });

  it('should not throw when optional labelMinZoom equals minZoom', () => {
    const def = makeValidDef({
      zoomRanges: [
        {
          type: 'COARSE',
          key: 'coarse',
          minZoom: 3,
          maxZoom: 8,
          labelMinZoom: 3,
        },
      ],
    });
    expect(() => validateDefinition(def)).not.toThrow();
  });

  it('should not throw when optional labelMinZoom equals maxZoom', () => {
    const def = makeValidDef({
      zoomRanges: [
        {
          type: 'COARSE',
          key: 'coarse',
          minZoom: 3,
          maxZoom: 8,
          labelMinZoom: 8,
        },
      ],
    });
    expect(() => validateDefinition(def)).not.toThrow();
  });

  // ── Required top-level fields ─────────────────────────────────────────────

  it('should throw when id is empty string', () => {
    expect(() => validateDefinition(makeValidDef({ id: '' }))).toThrow(
      'Grid definition must have an id',
    );
  });

  it('should throw when name is missing', () => {
    expect(() => validateDefinition(makeValidDef({ name: '' }))).toThrow(
      "Grid definition 'test-grid' must have a name",
    );
  });

  it('should throw when zoomRanges is empty', () => {
    expect(() => validateDefinition(makeValidDef({ zoomRanges: [] }))).toThrow(
      "Grid definition 'test-grid' must have at least one zoom range",
    );
  });

  it('should throw when renderer is missing', () => {
    expect(() =>
      validateDefinition(
        makeValidDef({ renderer: undefined as unknown as GridRenderer }),
      ),
    ).toThrow("Grid definition 'test-grid' must have a renderer");
  });

  it('should throw when defaultStyles is missing', () => {
    expect(() =>
      validateDefinition(
        makeValidDef({
          defaultStyles:
            undefined as unknown as GridDefinition['defaultStyles'],
        }),
      ),
    ).toThrow("Grid definition 'test-grid' must have defaultStyles");
  });

  // ── Zoom range field validation ───────────────────────────────────────────

  it('should throw when zoom range has no type', () => {
    const def = makeValidDef({
      zoomRanges: [{ type: '', key: 'coarse', minZoom: 0, maxZoom: 5 }],
    });
    expect(() => validateDefinition(def)).toThrow(
      "Grid definition 'test-grid': zoom range must have a type",
    );
  });

  it('should throw when zoom range has no key', () => {
    const def = makeValidDef({
      zoomRanges: [{ type: 'COARSE', key: '', minZoom: 0, maxZoom: 5 }],
    });
    expect(() => validateDefinition(def)).toThrow(
      "Grid definition 'test-grid': zoom range 'COARSE' must have a key",
    );
  });

  it('should throw when zoom range minZoom is not a number', () => {
    const def = makeValidDef({
      zoomRanges: [
        {
          type: 'COARSE',
          key: 'coarse',
          minZoom: undefined as unknown as number,
          maxZoom: 5,
        },
      ],
    });
    expect(() => validateDefinition(def)).toThrow(
      "Grid definition 'test-grid': zoom range 'coarse' must have a minZoom (number)",
    );
  });

  it('should throw when zoom range maxZoom is not a number', () => {
    const def = makeValidDef({
      zoomRanges: [
        {
          type: 'COARSE',
          key: 'coarse',
          minZoom: 0,
          maxZoom: undefined as unknown as number,
        },
      ],
    });
    expect(() => validateDefinition(def)).toThrow(
      "Grid definition 'test-grid': zoom range 'coarse' must have a maxZoom (number)",
    );
  });

  it('should throw when minZoom is greater than maxZoom', () => {
    const def = makeValidDef({
      zoomRanges: [{ type: 'COARSE', key: 'coarse', minZoom: 10, maxZoom: 5 }],
    });
    expect(() => validateDefinition(def)).toThrow(
      "Grid definition 'test-grid': Invalid zoom range for 'coarse' - minZoom (10) is greater than maxZoom (5)",
    );
  });

  it('should throw when labelMinZoom is less than minZoom', () => {
    const def = makeValidDef({
      zoomRanges: [
        {
          type: 'COARSE',
          key: 'coarse',
          minZoom: 3,
          maxZoom: 8,
          labelMinZoom: 2,
        },
      ],
    });
    expect(() => validateDefinition(def)).toThrow(
      "Grid definition 'test-grid': Invalid label zoom for 'coarse' - labelMinZoom (2) is less than minZoom (3)",
    );
  });

  it('should throw when labelMinZoom is greater than maxZoom', () => {
    const def = makeValidDef({
      zoomRanges: [
        {
          type: 'COARSE',
          key: 'coarse',
          minZoom: 3,
          maxZoom: 8,
          labelMinZoom: 9,
        },
      ],
    });
    expect(() => validateDefinition(def)).toThrow(
      "Grid definition 'test-grid': Invalid label zoom for 'coarse' - labelMinZoom (9) is greater than maxZoom (8)",
    );
  });

  // ── Default style validation ──────────────────────────────────────────────

  it('should throw when defaultStyles is missing an entry for a zoom range type', () => {
    const def = makeValidDef({ defaultStyles: {} });
    expect(() => validateDefinition(def)).toThrow(
      "Grid definition 'test-grid': Missing default style for grid type 'COARSE'",
    );
  });

  it('should throw when style is missing lineColor', () => {
    const def = makeValidDef({
      defaultStyles: {
        COARSE: { lineColor: undefined as unknown as number[], lineWidth: 2 },
      },
    });
    expect(() => validateDefinition(def)).toThrow(
      "Grid definition 'test-grid': Style for grid type 'COARSE' must have lineColor",
    );
  });

  it('should throw when style is missing lineWidth', () => {
    const def = makeValidDef({
      defaultStyles: {
        COARSE: {
          lineColor: [255, 0, 0, 255],
          lineWidth: undefined as unknown as number,
        },
      },
    });
    expect(() => validateDefinition(def)).toThrow(
      "Grid definition 'test-grid': Style for grid type 'COARSE' must have lineWidth (number)",
    );
  });

  // ── Renderer interface validation ─────────────────────────────────────────

  it('should throw when renderer.render is not a function', () => {
    const def = makeValidDef({
      renderer: {
        render: 'not-a-function' as unknown as GridRenderer['render'],
      },
    });
    expect(() => validateDefinition(def)).toThrow(
      "Grid definition 'test-grid': renderer must have a render method",
    );
  });

  // ── Multiple zoom ranges ──────────────────────────────────────────────────

  it('should validate all zoom ranges and catch error in second range', () => {
    const def = makeValidDef({
      zoomRanges: [
        { type: 'COARSE', key: 'coarse', minZoom: 0, maxZoom: 5 },
        { type: 'FINE', key: 'fine', minZoom: 10, maxZoom: 5 }, // invalid
      ],
      defaultStyles: {
        COARSE: { lineColor: [255, 0, 0, 255], lineWidth: 2 },
        FINE: { lineColor: [0, 255, 0, 255], lineWidth: 1 },
      },
    });
    expect(() => validateDefinition(def)).toThrow(
      "Grid definition 'test-grid': Invalid zoom range for 'fine' - minZoom (10) is greater than maxZoom (5)",
    );
  });
});
