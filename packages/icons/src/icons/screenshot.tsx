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
const SvgScreenshot = ({
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
      d='M4.5 4.5H9V3H4.5S3 3 3 4.5V9h1.5zM19.5 9V4.5H15V3h4.5C21 3 21 4.5 21 4.5V9zM4.5 15v4.5H7V21H4.5C3 21 3 19.5 3 19.5V15zM17 17a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M14 11h3l1.5 1.5h1q1.5 0 1.5 1.5v6c0 1.5-1.5 1.5-1.5 1.5h-8Q10 21.5 10 20v-6q0-1.5 1.5-1.5h1zm4 3-1.5-1.5h-2L13 14h-1.5v6h8v-6z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgScreenshot;
