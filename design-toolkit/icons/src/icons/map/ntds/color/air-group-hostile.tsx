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
const SvgAirGroupHostile = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & Props) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='FF0033'
    xmlns='http://www.w3.org/2000/svg'
    aria-labelledby='titleId'
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d='M22 12H18.667L12 5.33301L5.33301 12H2L12 2L22 12Z' fill='FF0033' />
    <path d='M17 12H13.667L12 10.333L10.333 12H7L12 7L17 12Z' fill='FF0033' />
  </svg>
);
export default SvgAirGroupHostile;
