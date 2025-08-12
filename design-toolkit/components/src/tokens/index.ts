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

export type RGBAColor = [number, number, number, number];

/** Semantic Colors **/
export const colorSurfaceDefault: RGBAColor = [11, 11, 11, 1];
export const colorSurfaceRaised: RGBAColor = [34, 34, 34, 1];
export const colorSurfaceOverlay: RGBAColor = [47, 47, 49, 1];
export const colorTransparentDark: RGBAColor = [0, 0, 0, 0.4];
export const colorTransparentLight: RGBAColor = [255, 255, 255, 0.08];
export const colorInteractive: RGBAColor = [86, 86, 86, 1];
export const colorInteractiveDefault: RGBAColor = [230, 230, 230, 1];
export const colorInteractiveHover: RGBAColor = [255, 255, 255, 1];
export const colorInteractiveHoverLight: RGBAColor = [137, 137, 137, 1];
export const colorInteractiveHoverDark: RGBAColor = [47, 47, 49, 1];
export const colorInteractiveDisabled: RGBAColor = [56, 56, 56, 1];
export const colorStaticLight: RGBAColor = [56, 56, 56, 1];
export const colorStaticDark: RGBAColor = [34, 34, 34, 1];
export const colorHighlight: RGBAColor = [40, 245, 190, 1];
export const colorHighlightBold: RGBAColor = [40, 245, 190, 1];
export const colorHighlightHover: RGBAColor = [24, 147, 114, 1];
export const colorHighlightSubtle: RGBAColor = [10, 61, 48, 1];
export const colorInfo: RGBAColor = [104, 104, 104, 1];
export const colorInfoBold: RGBAColor = [104, 104, 104, 1];
export const colorInfoHover: RGBAColor = [66, 66, 68, 1];
export const colorInfoSubtle: RGBAColor = [34, 34, 34, 1];
export const colorAdvisory: RGBAColor = [98, 166, 255, 1];
export const colorAdvisoryBold: RGBAColor = [98, 166, 255, 1];
export const colorAdvisoryHover: RGBAColor = [58, 100, 153, 1];
export const colorAdvisorySubtle: RGBAColor = [20, 33, 51, 1];
export const colorNormal: RGBAColor = [48, 210, 126, 1];
export const colorNormalBold: RGBAColor = [48, 210, 126, 1];
export const colorNormalHover: RGBAColor = [28, 126, 76, 1];
export const colorNormalSubtle: RGBAColor = [10, 42, 25, 1];
export const colorSerious: RGBAColor = [252, 164, 0, 1];
export const colorSeriousBold: RGBAColor = [252, 164, 0, 1];
export const colorSeriousHover: RGBAColor = [151, 98, 1, 1];
export const colorSeriousSubtle: RGBAColor = [50, 33, 0, 1];
export const colorCritical: RGBAColor = [212, 35, 29, 1];
export const colorCriticalBold: RGBAColor = [212, 35, 29, 1];
export const colorCriticalHover: RGBAColor = [127, 21, 17, 1];
export const colorCriticalSubtle: RGBAColor = [42, 7, 6, 1];
export const colorDefaultLight: RGBAColor = [255, 255, 255, 1];
export const colorDefaultDark: RGBAColor = [137, 137, 137, 1];
export const colorInverseDark: RGBAColor = [56, 56, 56, 1];
export const colorInverseLight: RGBAColor = [34, 34, 34, 1];
export const colorDisabled: RGBAColor = [86, 86, 86, 1];
export const colorClassificationMissing: RGBAColor = [11, 11, 11, 1];
export const colorClassificationUnclass: RGBAColor = [0, 122, 51, 1];
export const colorClassificationCui: RGBAColor = [80, 43, 133, 1];
export const colorClassificationConfidential: RGBAColor = [0, 51, 160, 1];
export const colorClassificationSecret: RGBAColor = [200, 16, 46, 1];
export const colorClassificationTopSecret: RGBAColor = [255, 140, 0, 1];
export const colorClassificationTsSci: RGBAColor = [252, 232, 58, 1];
/** Other Design Tokens **/
export const typographyHeaderXxlSize = 32;
export const typographyHeaderXxlHeight = 40;
export const typographyHeaderXxlSpacing = 0;
export const typographyHeaderXlSize = 24;
export const typographyHeaderXlHeight = 28;
export const typographyHeaderXlSpacing = 0.18;
export const typographyHeaderLSize = 20;
export const typographyHeaderLHeight = 24;
export const typographyHeaderLSpacing = 0.18;
export const typographyHeaderMSize = 14;
export const typographyHeaderMHeight = 20;
export const typographyHeaderMSpacing = 0.25;
export const typographyHeaderSSize = 12;
export const typographyHeaderSHeight = 16;
export const typographyHeaderSSpacing = 0.4;
export const typographyHeaderXsSize = 10;
export const typographyHeaderXsHeight = 12;
export const typographyHeaderXsSpacing = 0.25;
export const typographyBodyLSize = 16;
export const typographyBodyLHeight = 24;
export const typographyBodyLSpacing = 0.5;
export const typographyBodyMSize = 14;
export const typographyBodyMHeight = 20;
export const typographyBodyMSpacing = 0.25;
export const typographyBodySSize = 12;
export const typographyBodySHeight = 16;
export const typographyBodySSpacing = 0.4;
export const typographyBodyXsSize = 10;
export const typographyBodyXsHeight = 12;
export const typographyBodyXsSpacing = 0.5;
export const typographyBodyXxsSize = 9;
export const typographyBodyXxsHeight = 12;
export const typographyBodyXxsSpacing = 0.25;
export const typographyButtonLSize = 16;
export const typographyButtonLHeight = 24;
export const typographyButtonLSpacing = 0.5;
export const typographyButtonMSize = 14;
export const typographyButtonMHeight = 20;
export const typographyButtonMSpacing = 0.25;
export const typographyButtonSSize = 12;
export const typographyButtonSHeight = 16;
export const typographyButtonSSpacing = 0.4;
export const typographyButtonXsSize = 10;
export const typographyButtonXsHeight = 12;
export const typographyButtonXsSpacing = 0.5;
export const spacing0 = 0;
export const spacingNone = 'unset';
export const spacingXxs = 2;
export const spacingXs = 4;
export const spacingS = 8;
export const spacingM = 12;
export const spacingL = 16;
export const spacingXl = 24;
export const spacingXxl = 40;
export const spacingOversized = 80;
export const radiusNone = 0;
export const radiusSmall = 2;
export const radiusMedium = 4;
export const radiusLarge = 8;
export const radiusRound = 80;
export const shadowElevationDefault = 'initial';
export const shadowElevationOverlay =
  '0 8px 10px 0 rgba(0 0 0 / 0.2), 0 6px 30px 0 rgba(0 0 0 / 0.12), 0 16px 24px 0 rgba(0 0 0 / 0.14)';
export const shadowElevationRaised =
  '0 5px 5px 0 rgba(0 0 0 / 0.2), 0 3px 14px 0 rgba(0 0 0 / 0.12), 0 8px 10px 0 rgba(0 0 0 / 0.14)';
export const fontPrimary = '"Roboto Flex", sans-serif';
export const fontDisplay = '"Roboto Mono", monospace';
export const iconSizeL = 24;
export const iconSizeM = 20;
export const iconSizeS = 16;
export const iconSizeXs = 12;
