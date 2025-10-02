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

import type { ThemeTokens } from './types';
export const designTokens = {
  dark: {
    bg: {
      surface: {
        default: [21, 21, 23, 1],
        raised: [33, 34, 35, 1],
        overlay: [33, 34, 35, 1],
        muted: [255, 255, 255, 0.08],
      },
      interactive: {
        bold: {
          base: [255, 255, 255, 1],
          hover: [239, 241, 242, 1],
          pressed: [195, 197, 199, 1],
        },
        muted: {
          base: [56, 57, 58, 1],
          hover: [65, 66, 69, 1],
          pressed: [0, 0, 0, 1],
        },
        disabled: [56, 57, 58, 1],
      },
      accent: {
        primary: {
          bold: [0, 79, 126, 1],
          hover: [0, 104, 161, 1],
          pressed: [0, 44, 82, 1],
          muted: [0, 44, 82, 1],
        },
      },
      info: {
        bold: [86, 87, 89, 1],
        hover: [136, 138, 143, 1],
        pressed: [65, 66, 69, 1],
        muted: [33, 34, 35, 1],
      },
      advisory: {
        bold: [60, 103, 160, 1],
        hover: [78, 136, 218, 1],
        pressed: [38, 64, 98, 1],
        muted: [14, 24, 37, 1],
      },
      normal: {
        bold: [28, 126, 35, 1],
        hover: [38, 161, 46, 1],
        pressed: [20, 87, 24, 1],
        muted: [8, 33, 10, 1],
      },
      serious: {
        bold: [187, 122, 0, 1],
        hover: [230, 150, 0, 1],
        pressed: [99, 65, 1, 1],
        muted: [65, 43, 0, 1],
      },
      critical: {
        bold: [121, 5, 1, 1],
        hover: [161, 7, 1, 1],
        pressed: [84, 3, 0, 1],
        muted: [41, 2, 0, 1],
      },
    },
    fg: {
      hover: [255, 255, 255, 1],
      pressed: [136, 138, 143, 1],
      primary: {
        bold: [255, 255, 255, 1],
        muted: [195, 197, 199, 1],
      },
      inverse: {
        bold: [33, 34, 35, 1],
        muted: [136, 138, 143, 1],
      },
      disabled: [86, 87, 89, 1],
      accent: {
        primary: {
          bold: [57, 183, 250, 1],
          hover: [110, 209, 255, 1],
          pressed: [0, 104, 161, 1],
        },
      },
      info: {
        bold: [136, 138, 143, 1],
        hover: [225, 225, 225, 1],
        pressed: [65, 66, 69, 1],
      },
      advisory: {
        bold: [98, 166, 255, 1],
        hover: [169, 206, 255, 1],
        pressed: [60, 103, 160, 1],
      },
      normal: {
        bold: [43, 191, 53, 1],
        hover: [134, 233, 140, 1],
        pressed: [28, 126, 35, 1],
      },
      serious: {
        bold: [230, 150, 0, 1],
        hover: [255, 193, 76, 1],
        pressed: [187, 122, 0, 1],
      },
      critical: {
        bold: [255, 46, 39, 1],
        hover: [255, 109, 104, 1],
        pressed: [161, 7, 1, 1],
      },
      a11y: {
        'on-accent': [255, 255, 255, 1],
        'on-utility': [255, 255, 255, 1],
      },
    },
    outline: {
      static: [65, 66, 69, 1],
      interactive: {
        base: [65, 66, 69, 1],
        hover: [136, 138, 143, 1],
        pressed: [56, 57, 58, 1],
        disabled: [56, 57, 58, 1],
      },
      accent: {
        primary: {
          bold: [57, 183, 250, 1],
          hover: [110, 209, 255, 1],
          pressed: [0, 104, 161, 1],
        },
      },
      info: {
        bold: [136, 138, 143, 1],
        hover: [225, 225, 225, 1],
        pressed: [65, 66, 69, 1],
      },
      advisory: {
        bold: [98, 166, 255, 1],
        hover: [169, 206, 255, 1],
        pressed: [60, 103, 160, 1],
      },
      normal: {
        bold: [43, 191, 53, 1],
        hover: [134, 233, 140, 1],
        pressed: [28, 126, 35, 1],
      },
      serious: {
        bold: [230, 150, 0, 1],
        hover: [255, 211, 130, 1],
        pressed: [142, 93, 0, 1],
      },
      critical: {
        bold: [255, 46, 39, 1],
        hover: [255, 109, 104, 1],
        pressed: [161, 7, 1, 1],
      },
      mono: {
        bold: {
          base: [255, 255, 255, 1],
          hover: [239, 241, 242, 1],
          pressed: [195, 197, 199, 1],
        },
      },
    },
    shadow: {
      elevation: {
        raised: '0 1px 4px 0 rgba(0 0 0 / 0.80)',
        overlay: '0 8px 24px 0 rgba(0 0 0 / 0.80)',
      },
    },
  },
  light: {
    bg: {
      surface: {
        default: [239, 241, 242, 1],
        raised: [255, 255, 255, 1],
        overlay: [255, 255, 255, 1],
        muted: [0, 0, 0, 0.08],
      },
      interactive: {
        bold: {
          base: [21, 21, 23, 1],
          hover: [33, 34, 35, 1],
          pressed: [195, 197, 199, 1],
        },
        muted: {
          base: [195, 197, 199, 1],
          hover: [225, 225, 225, 1],
          pressed: [136, 138, 143, 1],
        },
        disabled: [225, 225, 225, 1],
      },
      accent: {
        primary: {
          bold: [0, 79, 126, 1],
          hover: [0, 104, 161, 1],
          pressed: [0, 44, 82, 1],
          muted: [177, 233, 255, 1],
        },
      },
      info: {
        bold: [136, 138, 143, 1],
        hover: [195, 197, 199, 1],
        pressed: [65, 66, 69, 1],
        muted: [239, 241, 242, 1],
      },
      advisory: {
        bold: [60, 103, 160, 1],
        hover: [78, 136, 218, 1],
        pressed: [38, 64, 98, 1],
        muted: [196, 222, 255, 1],
      },
      normal: {
        bold: [28, 126, 35, 1],
        hover: [38, 161, 46, 1],
        pressed: [20, 87, 24, 1],
        muted: [194, 245, 197, 1],
      },
      serious: {
        bold: [187, 122, 0, 1],
        hover: [230, 150, 0, 1],
        pressed: [99, 65, 1, 1],
        muted: [255, 234, 194, 1],
      },
      critical: {
        bold: [121, 5, 1, 1],
        hover: [161, 7, 1, 1],
        pressed: [84, 3, 0, 1],
        muted: [255, 196, 194, 1],
      },
    },
    fg: {
      hover: [33, 34, 35, 1],
      pressed: [86, 87, 89, 1],
      primary: {
        bold: [33, 34, 35, 1],
        muted: [86, 87, 89, 1],
      },
      inverse: {
        bold: [255, 255, 255, 1],
        muted: [136, 138, 143, 1],
      },
      disabled: [195, 197, 199, 1],
      accent: {
        primary: {
          bold: [57, 183, 250, 1],
          hover: [0, 79, 126, 1],
          pressed: [0, 104, 161, 1],
        },
      },
      info: {
        bold: [65, 66, 69, 1],
        hover: [56, 57, 58, 1],
        pressed: [86, 87, 89, 1],
      },
      advisory: {
        bold: [98, 166, 255, 1],
        hover: [60, 103, 160, 1],
        pressed: [78, 136, 218, 1],
      },
      normal: {
        bold: [43, 191, 53, 1],
        hover: [28, 126, 35, 1],
        pressed: [38, 161, 46, 1],
      },
      serious: {
        bold: [187, 122, 0, 1],
        hover: [142, 93, 0, 1],
        pressed: [187, 122, 0, 1],
      },
      critical: {
        bold: [255, 46, 39, 1],
        hover: [161, 7, 1, 1],
        pressed: [212, 11, 4, 1],
      },
      a11y: {
        'on-accent': [255, 255, 255, 1],
        'on-utility': [255, 255, 255, 1],
      },
    },
    outline: {
      static: [195, 197, 199, 1],
      interactive: {
        base: [195, 197, 199, 1],
        hover: [136, 138, 143, 1],
        pressed: [225, 225, 225, 1],
        disabled: [225, 225, 225, 1],
      },
      accent: {
        primary: {
          bold: [57, 183, 250, 1],
          hover: [0, 104, 161, 1],
          pressed: [110, 209, 255, 1],
        },
      },
      info: {
        bold: [136, 138, 143, 1],
        hover: [65, 66, 69, 1],
        pressed: [86, 87, 89, 1],
      },
      advisory: {
        bold: [98, 166, 255, 1],
        hover: [60, 103, 160, 1],
        pressed: [78, 136, 218, 1],
      },
      normal: {
        bold: [43, 191, 53, 1],
        hover: [28, 126, 35, 1],
        pressed: [38, 161, 46, 1],
      },
      serious: {
        bold: [187, 122, 0, 1],
        hover: [142, 93, 0, 1],
        pressed: [230, 150, 0, 1],
      },
      critical: {
        bold: [255, 46, 39, 1],
        hover: [161, 7, 1, 1],
        pressed: [212, 11, 4, 1],
      },
      mono: {
        bold: {
          base: [21, 21, 23, 1],
          hover: [56, 57, 58, 1],
          pressed: [65, 66, 69, 1],
        },
      },
    },
    shadow: {
      elevation: {
        raised: '0 1px 4px 0 rgba(0 0 0 / 0.16)',
        overlay: '0 8px 24px 0 rgba(0 0 0 / 0.16)',
      },
    },
  },
  static: {
    classification: {
      missing: [11, 11, 11, 1],
      unclass: [0, 122, 51, 1],
      cui: [80, 43, 133, 1],
      confidential: [0, 51, 160, 1],
      secret: [200, 16, 46, 1],
      'top-secret': [255, 140, 0, 1],
      'ts-sci': [252, 232, 58, 1],
    },
    roe: {
      pending: [64, 64, 64, 1],
      friend: [20, 132, 244, 1],
      'assumed-friend': [14, 143, 55, 1],
      neutral: [91, 19, 122, 1],
      unknown: [237, 218, 10, 1],
      suspect: [255, 173, 56, 1],
      hostile: [255, 0, 51, 1],
      'no-statement': [64, 64, 64, 1],
    },
  },
  typography: {
    header: {
      xxl: {
        size: 32,
        height: 40,
        spacing: 0,
      },
      xl: {
        size: 24,
        height: 28,
        spacing: 0.18,
      },
      l: {
        size: 20,
        height: 24,
        spacing: 0.18,
      },
      m: {
        size: 14,
        height: 20,
        spacing: 0.25,
      },
      s: {
        size: 12,
        height: 16,
        spacing: 0.4,
      },
      xs: {
        size: 10,
        height: 12,
        spacing: 0.25,
      },
    },
    body: {
      l: {
        size: 16,
        height: 24,
        spacing: 0.5,
      },
      m: {
        size: 14,
        height: 20,
        spacing: 0.25,
      },
      s: {
        size: 12,
        height: 16,
        spacing: 0.4,
      },
      xs: {
        size: 10,
        height: 12,
        spacing: 0.5,
      },
      xxs: {
        size: 9,
        height: 12,
        spacing: 0.25,
      },
    },
    button: {
      l: {
        size: 16,
        height: 24,
        spacing: 0.5,
      },
      m: {
        size: 14,
        height: 20,
        spacing: 0.25,
      },
      s: {
        size: 12,
        height: 16,
        spacing: 0.4,
      },
      xs: {
        size: 10,
        height: 12,
        spacing: 0.5,
      },
    },
  },
  spacing: {
    '0': 0,
    none: 'unset',
    xxs: 2,
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 40,
    oversized: 80,
  },
  radius: {
    none: 0,
    small: 2,
    medium: 4,
    large: 8,
    round: 80,
  },
  shadow: {
    elevation: {
      default: 'initial',
      overlay: {
        bold: '0 8px 24px 0 rgba(0 0 0 / 0.80)',
        muted: '0 8px 24px 0 rgba(0 0 0 / 0.16)',
      },
      raised: {
        bold: '0 1px 4px 0 rgba(0 0 0 / 0.80)',
        muted: '0 1px 4px 0 rgba(0 0 0 / 0.16)',
      },
    },
  },
} satisfies ThemeTokens;
