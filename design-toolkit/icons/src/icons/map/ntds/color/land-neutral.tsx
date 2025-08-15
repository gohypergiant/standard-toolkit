/**
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
interface Props {
  title?: string;
  titleId?: string;
}
const SvgLandNeutral = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & Props) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='5B137A'
    xmlns='http://www.w3.org/2000/svg'
    aria-labelledby='titleId'
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M16 16V8H8L8 16H16ZM18 6L6 6L6 18H18V6Z'
      fill='5B137A'
    />
    <path d='M12 10L14 12L12 14L10 12L12 10Z' fill='5B137A' />
    <path d='M13 23H11V19H13V23Z' fill='5B137A' />
    <path d='M23 11V13H19V11H23Z' fill='5B137A' />
    <path d='M5 13H1V11H5V13Z' fill='5B137A' />
    <path d='M13 5H11V1H13V5Z' fill='5B137A' />
  </svg>
);
export default SvgLandNeutral;
