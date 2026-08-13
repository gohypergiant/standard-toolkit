/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
const SvgWheel = ({
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
      d='M12 19.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15m0 1.5a9 9 0 1 0 0-18 9 9 0 0 0 0 18'
      clipRule='evenodd'
    />
    <path fill='currentColor' d='M11.25 3h1.5v18h-1.5z' />
    <path fill='currentColor' d='M20.625 11.25v1.5H3.485v-1.5z' />
    <path
      fill='currentColor'
      d='m17.834 5.106 1.06 1.06L6.166 18.894l-1.06-1.06z'
    />
    <path
      fill='currentColor'
      d='m18.894 17.834-1.06 1.06L5.106 6.166l1.06-1.06z'
    />
  </svg>
);
export default SvgWheel;
