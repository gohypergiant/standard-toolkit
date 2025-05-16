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

/**
 * THIS IS A GENERATED FILE. DO NOT ALTER DIRECTLY.
 */

import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgHide = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='m4.592 8.241.563-.266.563-.267.003.008.017.033q.023.048.075.141c.068.125.172.306.313.526.283.44.711 1.027 1.288 1.612 1.155 1.171 2.873 2.305 5.212 2.305s4.057-1.134 5.212-2.305a10.1 10.1 0 0 0 1.601-2.138l.075-.14.017-.034.003-.007.563.266.563.266-.002.002-.002.005-.007.014a5 5 0 0 1-.117.225 11.364 11.364 0 0 1-1.808 2.415c-1.3 1.32-3.318 2.676-6.098 2.676s-4.797-1.357-6.098-2.676c-.651-.66-1.131-1.318-1.449-1.812a10 10 0 0 1-.476-.828l-.007-.014-.003-.005z'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='m4.446 7.862-1.82.114.078 1.243 2.532-.159.478-1.348s-.35.025-1.268.15M6.759 10.854l-2.553 1.571.653 1.06 2.868-1.765c-.347-.277-.67-.57-.968-.866M10 13.066l-1.068 2.779 1.162.447 1.101-2.864a7.3 7.3 0 0 1-1.194-.362M14.057 13.428l1.1 2.864 1.163-.447-1.069-2.78c-.38.152-.78.276-1.194.363M17.525 11.72l2.868 1.765.653-1.06-2.553-1.57c-.298.296-.62.588-.968.865M20.016 9.06l2.532.159.078-1.243-3.084-.259.248.696z'
    />
  </svg>
);
export default SvgHide;
