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
const SvgZoomOut = ({
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
    <path fill='currentColor' d='M8 9h5v1H8z' />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M14.298 14.771 20 20.49 21.49 19l-5.756-5.652A6.46 6.46 0 0 0 17 9.5a6.5 6.5 0 1 0-6.5 6.5 6.46 6.46 0 0 0 3.798-1.229m1.436-1.423-.175.227q.09-.111.175-.227m-.304.382.13-.155zm-1.132 1.041q.113-.081.222-.168zm.432-.341-.21.173q.107-.084.21-.173M6 9.5c0 2.49 2.01 4.5 4.5 4.5S15 11.99 15 9.5 12.99 5 10.5 5 6 7.01 6 9.5'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgZoomOut;
