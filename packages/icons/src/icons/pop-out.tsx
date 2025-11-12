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
const SvgPopOut = ({
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
      d='M16 3H8.5C7 3 7 4.5 7 4.5v11C7 17 8.5 17 8.5 17h11s1.5 0 1.5-1.5v-11S21 3 19.5 3zv1.5h3.5v11h-11v-11H16z'
    />
    <path
      fill='currentColor'
      d='M7 7H4.5C3 7 3 8.5 3 8.5v11C3 21 4.5 21 4.5 21h11s1.5 0 1.5-1.5V17h-1.5v2.5h-11v-11H7z'
    />
  </svg>
);
export default SvgPopOut;
