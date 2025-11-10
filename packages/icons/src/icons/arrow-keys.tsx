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
const SvgArrowKeys = ({
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
      d='M2 14a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 8 14v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 2 17zM16 14a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 22 14v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 16 17zM9 14a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 14v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 17zM9 7a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 7v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 10z'
    />
    <path
      fill='#222'
      d='M13.5 15 12 17l-1.5-2zM6 17l-2-1.5L6 14zM18 14l2 1.5-2 1.5zM10.5 9.5l1.5-2 1.5 2z'
    />
  </svg>
);
export default SvgArrowKeys;
