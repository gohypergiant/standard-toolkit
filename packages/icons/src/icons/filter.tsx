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
const SvgFilter = ({
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
      d='M17 5.75h4v1.5h-4zM3 5.75h8v1.5H3zM3 17.75h6v1.5H3zM3 11.75h2v1.5H3zM11 11.75h10v1.5H11zM15 17.75h6v1.5h-6z'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M15.5 7.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5M9.5 13.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5M13.5 19.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgFilter;
