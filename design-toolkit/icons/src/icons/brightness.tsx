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
    <path fill='currentColor' d='M8.25 2.5V0h1.5v2.5z' />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M14 9A5 5 0 1 1 4 9a5 5 0 0 1 10 0m-1.5 0a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='M0 9.75h2.5v-1.5H0zM18 9.75h-2.5v-1.5H18zM8.25 15.5V18h1.5v-2.5zM14.81 2.13l-1.642 1.645 1.062 1.06 1.64-1.645zM3.778 4.844 2.117 3.206 3.17 2.138l1.661 1.637zM13.168 14.195l1.641 1.644 1.062-1.06-1.64-1.643zM2.117 14.764l1.661-1.638 1.053 1.069-1.66 1.637z'
    />
  </svg>
);
export default SvgBrightness;
