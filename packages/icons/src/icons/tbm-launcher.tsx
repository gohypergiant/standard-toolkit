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
const SvgTbmLauncher = ({
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
      fillRule='evenodd'
      d='M1 18v-4l2-3h4l1.5 3v2.5h8.595L8.2 4.64 11.72 2l9.9 13.2-1.733 1.3H23V18h-1a1.6 1.6 0 0 1-3.2 0H17a1.6 1.6 0 0 1-3.2 0H6.6a1.6 1.6 0 0 1-3.2 0Zm2.5-5.5h2.8l.8 2H2.5ZM10 4.415l1-.75 8.82 11.76-1 .75Z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgTbmLauncher;
