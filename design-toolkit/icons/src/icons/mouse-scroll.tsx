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
const SvgMouseScroll = ({
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
    <path fill='currentColor' d='M11 8v4h2V8z' />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M5 8c0-4.025 3.414-6 7-6s7 1.975 7 6v8a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6zm10.933-3.319C16.873 5.402 17.5 6.466 17.5 8v8a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 6.5 16V8c0-1.534.626-2.598 1.567-3.319C9.052 3.927 10.46 3.5 12 3.5s2.948.427 3.933 1.181'
      clipRule='evenodd'
    />
    <path fill='currentColor' d='M12.5 10V8h2L12 5.5 9.5 8h2v2z' />
    <path fill='currentColor' d='M11.5 9.5v2h-2L12 14l2.5-2.5h-2v-2z' />
  </svg>
);
export default SvgMouseScroll;
