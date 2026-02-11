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

// biome-ignore lint/style/useNamingConvention: acronym
type RGBA = [number, number, number, number];

/** Primitive color tokens which feed into semantic color tokens */
export type PrimitiveColorTokens = {
  neutral: {
    '50': RGBA;
    '100': RGBA;
    '200': RGBA;
    '300': RGBA;
    '400': RGBA;
    '500': RGBA;
    '600': RGBA;
    '700': RGBA;
    '800': RGBA;
    '900': RGBA;
    '950': RGBA;
  };
  alpha: {
    black: {
      '100': RGBA;
      '200': RGBA;
      '300': RGBA;
      '400': RGBA;
      '500': RGBA;
    };
    white: {
      '100': RGBA;
      '200': RGBA;
      '300': RGBA;
      '400': RGBA;
      '500': RGBA;
    };
  };
  accent: {
    primary: {
      '50': RGBA;
      '100': RGBA;
      '200': RGBA;
      '300': RGBA;
      '400': RGBA;
      '500': RGBA;
      '600': RGBA;
      '700': RGBA;
      '800': RGBA;
      '900': RGBA;
    };
    secondary: {
      '50': RGBA;
      '100': RGBA;
      '200': RGBA;
      '300': RGBA;
      '400': RGBA;
      '500': RGBA;
      '600': RGBA;
      '700': RGBA;
      '800': RGBA;
      '900': RGBA;
    };
    tertiary: {
      '50': RGBA;
      '100': RGBA;
      '200': RGBA;
      '300': RGBA;
      '400': RGBA;
      '500': RGBA;
      '600': RGBA;
      '700': RGBA;
      '800': RGBA;
      '900': RGBA;
    };
  };
  utility: {
    info: {
      '50': RGBA;
      '100': RGBA;
      '200': RGBA;
      '300': RGBA;
      '400': RGBA;
      '500': RGBA;
      '600': RGBA;
      '700': RGBA;
      '800': RGBA;
      '900': RGBA;
    };
    advisory: {
      '50': RGBA;
      '100': RGBA;
      '200': RGBA;
      '300': RGBA;
      '400': RGBA;
      '500': RGBA;
      '600': RGBA;
      '700': RGBA;
      '800': RGBA;
      '900': RGBA;
    };
    normal: {
      '50': RGBA;
      '100': RGBA;
      '200': RGBA;
      '300': RGBA;
      '400': RGBA;
      '500': RGBA;
      '600': RGBA;
      '700': RGBA;
      '800': RGBA;
      '900': RGBA;
    };
    serious: {
      '50': RGBA;
      '100': RGBA;
      '200': RGBA;
      '300': RGBA;
      '400': RGBA;
      '500': RGBA;
      '600': RGBA;
      '700': RGBA;
      '800': RGBA;
      '900': RGBA;
    };
    critical: {
      '50': RGBA;
      '100': RGBA;
      '200': RGBA;
      '300': RGBA;
      '400': RGBA;
      '500': RGBA;
      '600': RGBA;
      '700': RGBA;
      '800': RGBA;
      '900': RGBA;
    };
  };
  on: {
    accent: RGBA;
  };
};

/** Domain specific color tokens */
export type DomainColorTokens = {
  classification: {
    missing: RGBA;
    unclass: RGBA;
    cui: RGBA;
    confidential: RGBA;
    secret: RGBA;
    'top-secret': RGBA;
    'ts-sci': RGBA;
  };
  roe: {
    pending: RGBA;
    friend: RGBA;
    'assumed-friend': RGBA;
    neutral: RGBA;
    unknown: RGBA;
    suspect: RGBA;
    hostile: RGBA;
    'no-statement': RGBA;
  };
};

/** Semantic color tokens for backgrounds, foregrounds, outlines, and shadows */
export type SemanticColorTokens = {
  bg: {
    surface: {
      default: RGBA;
      raised: RGBA;
      overlay: RGBA;
      muted: RGBA;
    };
    interactive: {
      bold: {
        base: RGBA;
        hover: RGBA;
        pressed: RGBA;
      };
      muted: {
        base: RGBA;
        hover: RGBA;
        pressed: RGBA;
      };
      disabled: RGBA;
    };
    accent: {
      primary: {
        bold: RGBA;
        hover: RGBA;
        pressed: RGBA;
        muted: RGBA;
      };
    };
    info: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
      muted: RGBA;
    };
    advisory: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
      muted: RGBA;
    };
    normal: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
      muted: RGBA;
    };
    serious: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
      muted: RGBA;
    };
    critical: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
      muted: RGBA;
    };
  };
  fg: {
    hover: RGBA;
    pressed: RGBA;
    primary: {
      bold: RGBA;
      muted: RGBA;
    };
    inverse: {
      bold: RGBA;
      muted: RGBA;
    };
    disabled: RGBA;
    accent: {
      primary: {
        bold: RGBA;
        hover: RGBA;
        pressed: RGBA;
      };
    };
    info: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
    };
    advisory: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
    };
    normal: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
    };
    serious: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
    };
    critical: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
    };
    a11y: {
      'on-accent': RGBA;
      'on-utility': RGBA;
    };
  };
  outline: {
    static: RGBA;
    interactive: {
      base: RGBA;
      hover: RGBA;
      pressed: RGBA;
      disabled: RGBA;
    };
    accent: {
      primary: {
        bold: RGBA;
        hover: RGBA;
        pressed: RGBA;
      };
    };
    info: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
    };
    advisory: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
    };
    normal: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
    };
    serious: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
    };
    critical: {
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
    };
    mono: {
      bold: {
        base: RGBA;
        hover: RGBA;
        pressed: RGBA;
      };
    };
  };
  shadow: {
    elevation: {
      raised: string;
      overlay: string;
    };
  };
};

export type TypographyTokenSet = {
  header: {
    xxl: number;
    xl: number;
    l: number;
    m: number;
    s: number;
    xs: number;
  };
  body: {
    l: number;
    m: number;
    s: number;
    xs: number;
    xxs: number;
  };
  button: {
    l: number;
    m: number;
    s: number;
    xs: number;
  };
};

/** Complete theme token structure including colors, typography, spacing, radius, and shadows */
export type ThemeTokens = {
  dark: SemanticColorTokens;
  light: SemanticColorTokens;
  primitive: PrimitiveColorTokens;
  domain: DomainColorTokens;
  typography: {
    height: TypographyTokenSet;
    size: TypographyTokenSet;
    spacing: TypographyTokenSet;
    weight: TypographyTokenSet;
  };
  spacing: {
    '0': number;
    none: string | number;
    xxs: number;
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
    oversized: number;
  };
  radius: {
    none: number;
    small: number;
    medium: number;
    large: number;
    round: number;
  };
  shadow: {
    elevation: {
      default: string;
      overlay: {
        bold: string;
        muted: string;
      };
      raised: {
        bold: string;
        muted: string;
      };
    };
  };
};
