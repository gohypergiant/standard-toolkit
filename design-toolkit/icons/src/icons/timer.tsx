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
const SvgTimer = ({
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
      d='m14.26 10.294 1.171 1.17-3.43 3.43-1.17-1.17z'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M15.311 3.655V2h-6.62v1.655h2.481V5.49a8.277 8.277 0 1 0 7.236 2.998l1.659-1.658-1.17-1.17-1.659 1.658a8.24 8.24 0 0 0-4.41-1.828V3.655zM12 20.345a6.62 6.62 0 1 0 0-13.242 6.62 6.62 0 0 0 0 13.242'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgTimer;
