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

export type StaticColorTokens = {
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
      bold: RGBA;
      hover: RGBA;
      pressed: RGBA;
    };
  };
  shadow: {
    elevation: {
      raised: string;
      overlay: string;
    };
  };
};

export type ThemeTokens = {
  static: StaticColorTokens;
  dark: SemanticColorTokens;
  light: SemanticColorTokens;
  typography: {
    header: {
      xxl: {
        size: number;
        height: number;
        spacing: number;
      };
      xl: {
        size: number;
        height: number;
        spacing: number;
      };
      l: {
        size: number;
        height: number;
        spacing: number;
      };
      m: {
        size: number;
        height: number;
        spacing: number;
      };
      s: {
        size: number;
        height: number;
        spacing: number;
      };
      xs: {
        size: number;
        height: number;
        spacing: number;
      };
    };
    body: {
      l: {
        size: number;
        height: number;
        spacing: number;
      };
      m: {
        size: number;
        height: number;
        spacing: number;
      };
      s: {
        size: number;
        height: number;
        spacing: number;
      };
      xs: {
        size: number;
        height: number;
        spacing: number;
      };
      xxs: {
        size: number;
        height: number;
        spacing: number;
      };
    };
    button: {
      l: {
        size: number;
        height: number;
        spacing: number;
      };
      m: {
        size: number;
        height: number;
        spacing: number;
      };
      s: {
        size: number;
        height: number;
        spacing: number;
      };
      xs: {
        size: number;
        height: number;
        spacing: number;
      };
    };
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
