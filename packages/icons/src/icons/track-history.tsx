/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
const SvgTrackHistory = ({
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
      d='m16.621 3.742 1.566-.721-.722 1.565-1.172 2.579a7.412 7.412 0 0 0-5.136 11.305l-.587 1.307-.58-1.43-2.062-5.068-5.068-2.063-1.43-.58 1.534-.688z'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M17.41 19.123a4.631 4.631 0 1 0 0-9.263 4.631 4.631 0 0 0 0 9.263m0 1.39a6.02 6.02 0 1 0 0-12.042 6.02 6.02 0 0 0 0 12.041'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='m16.319 11.019 1.39.001-.005 3.34 2.554 2.344-.94 1.023-3.004-2.758z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgTrackHistory;
