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
const SvgCoverage = ({
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
      d='M3.5 12c0 2.071.84 3.946 2.197 5.303l-1.061 1.061a9 9 0 1 1 12.728 0l-1.06-1.06A7.5 7.5 0 1 0 3.5 12'
    />
    <path
      fill='currentColor'
      d='m13.917 14.917.972.972a5.5 5.5 0 1 0-7.778 0l.972-.972a4.125 4.125 0 1 1 5.834 0'
    />
    <path fill='currentColor' d='M11 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4' />
  </svg>
);
export default SvgCoverage;
