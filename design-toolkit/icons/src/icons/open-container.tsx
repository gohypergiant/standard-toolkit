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
const SvgOpenContainer = ({
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
      d='M9.626 7h-4.5c-1.5 0-1.5 1.5-1.5 1.5v11c0 1.5 1.5 1.5 1.5 1.5h15s1.5 0 1.5-1.5v-11s0-1.5-1.5-1.5h-4.5v1.5h4.5v11h-15v-11h4.5z'
    />
    <path
      fill='currentColor'
      d='M13.379 4.5V12h3.247l-4.05 3.9-3.95-3.9 3.25.008V4.5h-6.25V3c2 0 4.25.006 6.25.006 1.503 0 1.503 1.494 1.503 1.494'
    />
  </svg>
);
export default SvgOpenContainer;
