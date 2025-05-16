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
const SvgPlayback = ({
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
      d='M7.279 6.304A7.74 7.74 0 0 1 12.78 4c2.063 0 4.042.829 5.501 2.304a7.9 7.9 0 0 1 2.28 5.563c0 2.086-.82 4.087-2.28 5.562a7.74 7.74 0 0 1-5.501 2.304 7.7 7.7 0 0 1-2.977-.598 7.7 7.7 0 0 1-2.521-1.71l1.228-1.24a5.97 5.97 0 0 0 4.27 1.8c3.345 0 6.051-2.736 6.051-6.118s-2.706-6.119-6.051-6.119C9.67 5.748 7.345 7.934 7 11h2.5L6 14.5 2.5 11H5c.25-2.332 1.029-3.432 2.279-4.696'
    />
    <path fill='currentColor' d='M11 9v6l5-3z' />
  </svg>
);
export default SvgPlayback;
