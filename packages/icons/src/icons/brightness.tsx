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
const SvgBrightness = ({
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
    <path fill='currentColor' d='M11.25 5.5V3h1.5v2.5z' />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0m-1.5 0a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='M3 12.75h2.5v-1.5H3zM21 12.75h-2.5v-1.5H21zM11.25 18.5V21h1.5v-2.5zM17.81 5.13l-1.642 1.645 1.062 1.06 1.64-1.645zM6.778 7.844l-1.66-1.638L6.17 5.138l1.661 1.637zM16.168 17.195l1.641 1.644 1.062-1.06-1.64-1.643zM5.117 17.764l1.661-1.638 1.053 1.069-1.66 1.637z'
    />
  </svg>
);
export default SvgBrightness;
