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
const SvgSamFriend = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & Props) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='1484F4'
    xmlns='http://www.w3.org/2000/svg'
    aria-labelledby='titleId'
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M13.5 17.5L18 22H6L10.5 17.5V8H13.5V17.5ZM11 20H13L12 19L11 20Z'
      fill='1484F4'
    />
    <path d='M17 7V17H15V8L12 5L9 8V17H7V7L12 2L17 7Z' fill='1484F4' />
  </svg>
);
export default SvgSamFriend;
