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
const SvgGroup = ({
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
      d='M16.5 6h-6C9 6 9 7.5 9 7.5v6C9 15 10.5 15 10.5 15h6s1.5 0 1.5-1.5v-6S18 6 16.5 6v7.5h-6v-6h6z'
    />
    <path
      fill='currentColor'
      d='M9 9H7.5C6 9 6 10.5 6 10.5v6C6 18 7.5 18 7.5 18h6s1.5 0 1.5-1.5V15h-1.5v1.5h-6v-6H9z'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M3 17.25v2.25c0 1.105.395 1.5 1.5 1.5h2.25v-1.5H4.5v-2.25zm0-3.5h1.5v-3.5H3zm0-7h1.5V4.5h2.25V3H4.5C3.395 3 3 3.395 3 4.5zM10.25 3v1.5h3.5V3zm7 0v1.5h2.25v2.25H21V4.5c0-1.105-.395-1.5-1.5-1.5zM21 10.25h-1.5v3.5H21zm0 7h-1.5v2.25h-2.25V21h2.25c1.105 0 1.5-.395 1.5-1.5zM13.75 21v-1.5h-3.5V21z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgGroup;
