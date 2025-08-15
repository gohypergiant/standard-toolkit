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
const SvgSurfaceGroupUnknown = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & Props) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='EDDA0A'
    xmlns='http://www.w3.org/2000/svg'
    aria-labelledby='titleId'
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M17 17H7V7H17V17ZM9.5 14H14.5V10H9.5V14Z'
      fill='EDDA0A'
    />
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M22 22H2V2H22V22ZM4.72754 19.2725H19.2725V4.72754H4.72754V19.2725Z'
      fill='EDDA0A'
    />
  </svg>
);
export default SvgSurfaceGroupUnknown;
