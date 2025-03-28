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

import {
  type CSSProperties,
  createTheme,
  createThemeContract,
  fallbackVar,
} from '@vanilla-extract/css';
import type { MapLeafNodes } from '../types';

/**
 * Values should be set as rgb(a) values to support sharing over to DeckGL
 */
export const genericColorVars = createThemeContract({
  neutral: {
    v01: '',
    v02: '',
    v03: '',
    v04: '',
    v05: '',
    v06: '',
    v07: '',
    v08: '',
    v09: '',
    v10: '',
  },
  alpha: {
    black: {
      v1: '',
      v2: '',
      v3: '',
    },
    white: {
      v1: '',
      v2: '',
      v3: '',
    },
  },
  highlight: {
    primary: {
      v1: '',
      v2: '',
      v3: '',
      v4: '',
      v5: '',
    },
    secondary: {
      v1: '',
      v2: '',
      v3: '',
      v4: '',
      v5: '',
    },
    tertiary: {
      v1: '',
      v2: '',
      v3: '',
      v4: '',
      v5: '',
    },
  },
  condition: {
    base: {
      v1: '',
      v2: '',
      v3: '',
      v4: '',
      v5: '',
    },
    advisory: {
      v1: '',
      v2: '',
      v3: '',
      v4: '',
      v5: '',
    },
    affirmative: {
      v1: '',
      v2: '',
      v3: '',
      v4: '',
      v5: '',
    },
    serious: {
      v1: '',
      v2: '',
      v3: '',
      v4: '',
      v5: '',
    },
    critical: {
      v1: '',
      v2: '',
      v3: '',
      v4: '',
      v5: '',
    },
  },
});

export const defaultGenericColorVarValues: MapLeafNodes<
  typeof genericColorVars,
  string
> = {
  neutral: {
    v01: 'rgba(255, 255, 255, 1)',
    v02: 'rgba(236, 236, 230, 1)',
    v03: 'rgba(137, 137, 137, 1)',
    v04: 'rgba(104, 104, 104, 1)',
    v05: 'rgba(86, 86, 86, 1)',
    v06: 'rgba(66, 66, 68, 1)',
    v07: 'rgba(56, 56, 56, 1)',
    v08: 'rgba(47, 47, 49, 1)',
    v09: 'rgba(34, 34, 34, 1)',
    v10: 'rgba(11, 11, 11, 1)',
  },
  alpha: {
    black: {
      v1: 'rgba(0, 0, 0, 0.08)',
      v2: 'rgba(0, 0, 0, 0.4)',
      v3: 'rgba(0, 0, 0, 0.8)',
    },
    white: {
      v1: 'rgba(255, 255, 255, 0.08)',
      v2: 'rgba(255, 255, 255, 0.4)',
      v3: 'rgba(255, 255, 255, 0.8)',
    },
  },
  highlight: {
    primary: {
      v1: 'rgba(201, 253, 239, 1)',
      v2: 'rgba(125, 249, 216, 1)',
      v3: 'rgba(40, 245, 190, 1)',
      v4: 'rgba(24, 147, 114, 1)',
      v5: 'rgba(10, 61, 48, 1)',
    },
    secondary: {
      v1: 'rgba(201, 246, 253, 1)',
      v2: 'rgba(126, 233, 249, 1)',
      v3: 'rgba(40, 220, 245, 1)',
      v4: 'rgba(24, 132, 147, 1)',
      v5: 'rgba(10, 55, 61, 1)',
    },
    tertiary: {
      v1: 'rgba(249, 197, 226, 1)',
      v2: 'rgba(241, 116, 185, 1)',
      v3: 'rgba(232, 23, 138, 1)',
      v4: 'rgba(138, 14, 83, 1)',
      v5: 'rgba(58, 6, 35, 1)',
    },
  },
  condition: {
    base: {
      v1: genericColorVars.neutral.v02,
      v2: genericColorVars.neutral.v03,
      v3: genericColorVars.neutral.v04,
      v4: genericColorVars.neutral.v07,
      v5: genericColorVars.neutral.v09,
    },
    advisory: {
      v1: 'rgba(224, 237, 255, 1)',
      v2: 'rgba(161, 202, 255, 1)',
      v3: 'rgba(98, 166, 255, 1)',
      v4: 'rgba(58, 100, 153, 1)',
      v5: 'rgba(20, 33, 51, 1)',
    },
    affirmative: {
      v1: 'rgba(214, 246, 229, 1)',
      v2: 'rgba(130, 228, 178, 1)',
      v3: 'rgba(48, 210, 126, 1)',
      v4: 'rgba(28, 126, 76, 1)',
      v5: 'rgba(10, 42, 25, 1)',
    },
    serious: {
      v1: 'rgba(254, 237, 204, 1)',
      v2: 'rgba(253, 200, 101, 1)',
      v3: 'rgba(252, 164, 0, 1)',
      v4: 'rgba(151, 98, 1, 1)',
      v5: 'rgba(50, 33, 0, 1)',
    },
    critical: {
      v1: 'rgba(246, 211, 210, 1)',
      v2: 'rgba(229, 123, 119, 1)',
      v3: 'rgba(212, 35, 29, 1)',
      v4: 'rgba(127, 21, 17, 1)',
      v5: 'rgba(42, 7, 6, 1)',
    },
  },
};

export const defaultGenericColors = createTheme(
  genericColorVars,
  defaultGenericColorVarValues,
);

/**
 * Values should be set as rgb(a) values to support sharing over to DeckGL
 */
export const semanticColorVars = createThemeContract({
  background: {
    surface: {
      default: '',
      raised: '',
      overlay: '',
    },
    interactive: {
      default: '',
      disabled: '',
      active: '',
    },
    transparent: {
      black: '',
      white: '',
    },
    highlight: {
      bold: '',
      subtle: '',
    },
    info: {
      bold: '',
      subtle: '',
    },
    advisory: {
      bold: '',
      subtle: '',
    },
    affirmative: {
      bold: '',
      subtle: '',
    },
    serious: {
      bold: '',
      subtle: '',
    },
    critical: {
      bold: '',
      subtle: '',
    },
  },
  foreground: {
    interactive: {
      primary: {
        bold: '',
        subtle: '',
      },
      secondary: {
        bold: '',
        subtle: '',
      },
      disabled: '',
      highlight: '',
    },
    info: '',
    advisory: '',
    affirmative: '',
    serious: '',
    critical: '',
  },
  border: {
    static: {
      exterior: '',
      interior: '',
    },
    interactive: {
      default: '',
      hover: '',
      disabled: '',
      highlight: '',
    },
    info: '',
    advisory: '',
    affirmative: '',
    serious: '',
    critical: '',
  },
});

export const defaultSemanticColorVarValues: MapLeafNodes<
  typeof semanticColorVars,
  string
> = {
  background: {
    surface: {
      default: genericColorVars.neutral.v10,
      raised: genericColorVars.neutral.v09,
      overlay: genericColorVars.neutral.v08,
    },
    interactive: {
      default: genericColorVars.neutral.v01,
      disabled: genericColorVars.neutral.v08,
      active: genericColorVars.neutral.v07,
    },
    transparent: {
      black: genericColorVars.alpha.black.v2,
      white: genericColorVars.alpha.white.v2,
    },
    highlight: {
      bold: genericColorVars.highlight.primary.v3,
      subtle: genericColorVars.highlight.primary.v5,
    },
    info: {
      bold: genericColorVars.condition.base.v3,
      subtle: genericColorVars.condition.base.v5,
    },
    advisory: {
      bold: genericColorVars.condition.advisory.v3,
      subtle: genericColorVars.condition.advisory.v5,
    },
    affirmative: {
      bold: genericColorVars.condition.affirmative.v3,
      subtle: genericColorVars.condition.affirmative.v5,
    },
    serious: {
      bold: genericColorVars.condition.serious.v3,
      subtle: genericColorVars.condition.serious.v5,
    },
    critical: {
      bold: genericColorVars.condition.critical.v3,
      subtle: genericColorVars.condition.critical.v5,
    },
  },
  foreground: {
    interactive: {
      primary: {
        bold: genericColorVars.neutral.v01,
        subtle: genericColorVars.neutral.v02,
      },
      secondary: {
        bold: genericColorVars.neutral.v09,
        subtle: genericColorVars.neutral.v08,
      },
      disabled: genericColorVars.neutral.v04,
      highlight: genericColorVars.highlight.primary.v3,
    },
    info: genericColorVars.condition.base.v3,
    advisory: genericColorVars.condition.advisory.v3,
    affirmative: genericColorVars.condition.affirmative.v3,
    serious: genericColorVars.condition.serious.v3,
    critical: genericColorVars.condition.critical.v3,
  },
  border: {
    static: {
      exterior: genericColorVars.neutral.v07,
      interior: genericColorVars.neutral.v09,
    },
    interactive: {
      default: genericColorVars.neutral.v06,
      hover: genericColorVars.neutral.v01,
      disabled: genericColorVars.neutral.v07,
      highlight: genericColorVars.highlight.primary.v3,
    },
    info: genericColorVars.condition.base.v3,
    advisory: genericColorVars.condition.advisory.v3,
    affirmative: genericColorVars.condition.affirmative.v3,
    serious: genericColorVars.condition.serious.v3,
    critical: genericColorVars.condition.critical.v3,
  },
};

export const defaultSemanticColors = createTheme(
  semanticColorVars,
  defaultSemanticColorVarValues,
);

export const elevationVars = createThemeContract({
  default: {
    surface: '',
    shadow: '',
    color: '',
  },
  raised: {
    surface: '',
    shadow: '',
    color: '',
  },
  overlay: {
    surface: '',
    shadow: '',
    color: '',
  },
});

export const defaultElevationVarValues: MapLeafNodes<
  typeof elevationVars,
  string
> = {
  default: {
    surface: genericColorVars.neutral.v10,
    shadow: 'none',
    color: genericColorVars.neutral.v01,
  },
  raised: {
    surface: genericColorVars.neutral.v09,
    shadow: `0 3px 14px 0 rgb(from ${genericColorVars.neutral.v10} r g b / 0.12), 0 8px 10px 0 rgb(from ${genericColorVars.neutral.v10} r g b / 0.14), 0 5px 5px 0 rgb(from ${genericColorVars.neutral.v10} r g b / 0.2)`,
    color: genericColorVars.neutral.v01,
  },
  overlay: {
    surface: genericColorVars.neutral.v08,
    shadow: `0 5px 22px 0 rgb(from ${genericColorVars.neutral.v10} r g b / 0.12), 0 12px 17px 0 rgb(from ${genericColorVars.neutral.v10} r g b / 0.14), 0 7px 8px 0 rgb(from ${genericColorVars.neutral.v10} r g b / 0.2)`,
    color: genericColorVars.neutral.v01,
  },
};

export const defaultElevations = createTheme(
  elevationVars,
  defaultElevationVarValues,
);

/**
 * Values should be set as pixel values to support sharing over to DeckGL
 */
export const sizeVars = createThemeContract({
  none: '',
  v01: '',
  v02: '',
  v03: '',
  v04: '',
  v05: '',
  v06: '',
  v07: '',
  v08: '',
  v09: '',
  v10: '',
});

export const defaultSizesVarValues: MapLeafNodes<typeof sizeVars, string> = {
  none: '0',
  v01: '1px',
  v02: '2px',
  v03: '4px',
  v04: '8px',
  v05: '12px',
  v06: '16px',
  v07: '24px',
  v08: '40px',
  v09: '80px',
  v10: '',
};

export const defaultSizes = createTheme(sizeVars, defaultSizesVarValues);

export const spaceVars = createThemeContract({
  heading: '',
  paragraph: '',
  list: {
    group: '',
    item: '',
  },
  lastChild: '',
});

export const defaultSpaceVarValues: MapLeafNodes<typeof spaceVars, string> = {
  heading: '0.5em',
  paragraph: '0.33em',
  list: {
    group: '0.33em',
    item: '0.1em',
  },
  lastChild: '0',
};

export const defaultSpace = createTheme(spaceVars, defaultSpaceVarValues);

export const radiusVars = createThemeContract({
  none: '',
  sm: '',
  md: '',
  lg: '',
  round: '',
});

export const defaultRadiusVarValues: MapLeafNodes<typeof radiusVars, string> = {
  none: '0',
  sm: sizeVars.v02,
  md: sizeVars.v03,
  lg: sizeVars.v04,
  /**
   * Use fixed unit instead of percentage to create pills instead of ovals
   * Use arbitrarily large value to be applicable to elements of all sizes
   * https://drafts.csswg.org/css-backgrounds/#corner-overlap
   * https://jsfiddle.net/5qBSb/30/
   */
  round: '9999px',
};

export const defaultRadius = createTheme(radiusVars, defaultRadiusVarValues);

export const typographyVars = createThemeContract({
  mono: '',
  sans: '',
  serif: '',
  heading: {
    v1: {
      height: '',
      size: '',
      spacing: '',
      weight: '',
    },
    v2: {
      height: '',
      size: '',
      spacing: '',
      weight: '',
    },
    v3: {
      height: '',
      size: '',
      spacing: '',
      weight: '',
    },
    v4: {
      height: '',
      size: '',
      spacing: '',
      weight: '',
    },
    v5: {
      height: '',
      size: '',
      spacing: '',
      weight: '',
    },
    v6: {
      height: '',
      size: '',
      spacing: '',
      weight: '',
    },
  },
  body: {
    xs: {
      height: '',
      size: '',
      spacing: '',
      weight: '',
    },
    sm: {
      height: '',
      size: '',
      spacing: '',
      weight: '',
    },
    md: {
      height: '',
      size: '',
      spacing: '',
      weight: '',
    },
    lg: {
      height: '',
      size: '',
      spacing: '',
      weight: '',
    },
    xl: {
      height: '',
      size: '',
      spacing: '',
      weight: '',
    },
  },
  input: {
    sm: {
      height: '',
      size: '',
      spacing: '',
      weight: '',
    },
    lg: {
      height: '',
      size: '',
      spacing: '',
      weight: '',
    },
  },
  label: {
    height: '',
    size: '',
    spacing: '',
    weight: '',
  },
});

export const defaultTypographyVarValues: MapLeafNodes<
  typeof typographyVars,
  string
> = {
  mono: '',
  sans: '',
  serif: '',
  heading: {
    v1: {
      height: '1.25',
      size: '32px',
      spacing: 'normal',
      weight: '500',
    },
    v2: {
      size: '24px',
      spacing: 'normal',
      height: '1.33',
      weight: '500',
    },
    v3: {
      height: '1.4',
      size: '20px',
      spacing: 'normal',
      weight: '500',
    },
    v4: {
      height: '1.425',
      size: '14px',
      spacing: '0.25px',
      weight: '500',
    },
    v5: {
      height: '1.33',
      size: '12px',
      spacing: '0.4px',
      weight: '500',
    },
    v6: {
      height: '1.2',
      size: '10px',
      spacing: '0.5px',
      weight: '400',
    },
  },
  body: {
    xs: {
      height: '1.2',
      size: '10px',
      spacing: '0.5px',
      weight: '400',
    },
    sm: {
      height: '1.33',
      size: '12px',
      spacing: '0.4px',
      weight: '400',
    },
    md: {
      height: '1.425',
      size: '14px',
      spacing: '0.25px',
      weight: '400',
    },
    lg: {
      height: '1.5',
      size: '16px',
      spacing: '0.5px',
      weight: '400',
    },
    xl: {
      height: '1.6',
      size: '18px',
      spacing: '0.6px',
      weight: '400',
    },
  },
  input: {
    sm: typographyVars.body.sm,
    lg: typographyVars.body.md,
  },
  label: {
    ...typographyVars.body.md,
    weight: '500',
  },
};

export const defaultTypography = createTheme(
  typographyVars,
  defaultTypographyVarValues,
);

export const zIndexVars = createThemeContract({
  popover: '', // Inline interactive elements, ex: Select menu
  layout: '', // Global elements, ex: Navigation bar
  drawer: '', // Slide in navigation / contextual content
  modal: '', // Large form global blocking content
  dialog: '', // Small form transactional content (global or local)
  popup: '', // High priority information, ex: Alerts, Notifications
  tooltip: '', // Contextual information
});

export const defaultZIndexVarValues: MapLeafNodes<typeof zIndexVars, string> = {
  popover: '100',
  layout: '200',
  drawer: '300',
  modal: '400',
  dialog: '500',
  popup: '600',
  tooltip: '700',
};

export const defaultZIndex = createTheme(zIndexVars, defaultZIndexVarValues);

export const focusVars = createThemeContract({
  offset: '',
  width: '',
  style: '',
  color: '',
});

export const defaultFocusVarValues: MapLeafNodes<typeof focusVars, string> = {
  offset: sizeVars.v02,
  width: '1.5px',
  style: 'solid',
  color: '',
};

export const defaultFocus = createTheme(focusVars, defaultFocusVarValues);

export const focusOutlineStyle: CSSProperties = {
  outline: [
    `${focusVars.width} ${focusVars.style} ${fallbackVar(focusVars.color, 'Highlight')}`,
    `${focusVars.width} ${focusVars.style} ${fallbackVar(focusVars.color, '-webkit-focus-ring-color')}`,
  ],
  outlineOffset: focusVars.offset,
};
