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
const SvgUas = ({
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
      d='M13.003 16.88 13 17.01a3 3 0 1 0 1.166-2.376l.832-5.394a3 3 0 1 0-.991-2.03 1.4 1.4 0 0 0-.721-.206h-2.572a1.4 1.4 0 0 0-.72.206Q10 7.108 10 7.003a3 3 0 1 0-.998 2.236l.832 5.394a3 3 0 1 0 1.164 2.248q.27.126.573.128h.858q.302-.002.574-.128m2.17-1.124a1.5 1.5 0 1 1-.67 1.343l-.838-.42a.75.75 0 0 1 .67-1.342zM8 15.508a1.5 1.5 0 1 0 1.497 1.59l.838-.419a.75.75 0 0 0-.67-1.342l-.838.419A1.5 1.5 0 0 0 8 15.508M5.5 7.003a1.5 1.5 0 0 1 2.997-.09l1.838.92a.75.75 0 0 1-.67 1.342l-1.838-.92A1.5 1.5 0 0 1 5.5 7.003m10.003-.09a1.5 1.5 0 1 1 .67 1.343l-1.838.92a.75.75 0 1 1-.67-1.343z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgUas;
