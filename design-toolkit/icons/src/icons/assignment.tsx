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
const SvgAssignment = ({
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
      d='m17.259 7.707-4.386 4.604h-1.076l.016-1.061 4.385-4.604z'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M18.818 1.953 22 5.135l-2.919 2.918-2.812-.37-.37-2.812zm0 2.121-1.335 1.335.123.937.938.124 1.335-1.335z'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='m22 5.135-3.182-3.182-2.919 2.918.242 1.836-4.328 4.543-.016 1.06h1.076l4.296-4.508 1.912.251zm-4.517.274 1.335-1.335 1.06 1.06-1.334 1.336-.938-.124z'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='M14.884 4.449a8.036 8.036 0 1 0 4.61 4.595l-1.722-.163a6.536 6.536 0 1 1-2.704-2.702z'
    />
    <path
      fill='currentColor'
      d='M14.113 7.386a5.044 5.044 0 1 0 2.455 2.496l-1.16 1.218q.102.411.103.852a3.544 3.544 0 1 1-2.516-3.392z'
    />
    <path
      fill='currentColor'
      d='m13.946 9.011 1.045-1.097c.402.302.757.662 1.053 1.068l-1.059 1.112c-.265-.43-.62-.8-1.04-1.083M17.105 7.87a6.6 6.6 0 0 0-1.065-1.057l.1-.106-.233-1.78c.613.342 1.176.761 1.676 1.245l.023.174.174.023c.484.5.903 1.064 1.245 1.677l-1.856-.244z'
    />
  </svg>
);
export default SvgAssignment;
