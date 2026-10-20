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
const SvgJltv = ({
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
      d='M1 14v-2.5L7.8 10 10 7h5.4l1.9 1.5v-2h4.4V14H23v2h-1v1.7a2.6 2.6 0 0 1-5.2 0V16H8v1.7a2.6 2.6 0 0 1-5.2 0V16H1Zm9.6-5.9h1.8v2.4H9Zm2.9.2H15l1.1.9v1.3h-2.6ZM3.2 15.4q2.2-2.8 4.4 0l-.8.5q-1.4-1.7-2.8 0Zm14.4 0q1.8-2.5 3.6 0l-.7.6q-1.1-1.5-2.2 0Z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgJltv;
