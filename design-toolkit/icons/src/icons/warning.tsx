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
const SvgWarning = ({
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
      d='M11 9.5h2l-.25 5.5h-1.5zM12 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M11.174 3.969a1 1 0 0 1 1.72-.04L21 18.999c.416.667-.019 1.5-.804 1.5H3.71c-.765 0-1.085-.833-.71-1.5zm-6.61 15.03L12 5.5 19.5 19z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgWarning;
