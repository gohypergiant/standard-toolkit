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
const SvgLink = ({
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
      d='M10.94 13.06 9.878 12l6.364-6.364 4.242 4.242-7.424 7.425s1.06 1.06 2.12 0l6.365-6.364s1.06-1.06 0-2.121l-4.243-4.243c-1.06-1.06-2.121 0-2.121 0L8.818 10.94s-1.06 1.06 0 2.121l1.06 1.061z'
    />
    <path
      fill='currentColor'
      d='M7.757 18.364 3.515 14.12l7.424-7.425c-.78-.78-1.34-.78-2.121 0L2.454 13.06s-1.06 1.061 0 2.122l4.243 4.242c1.06 1.061 2.12 0 2.12 0l6.365-6.364c1.06-1.06 0-2.12 0-2.12l-1.06-1.062-1.061 1.061L14.12 12z'
    />
  </svg>
);
export default SvgLink;
