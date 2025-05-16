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
const SvgSuccess = ({
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
      d='M8.996 15.91c1.415 1.415 2.824.006 2.824.006l6.07-6.072-1.231-1.232-6.231 6.232-3.011-3.01-1.25 1.248c.447.44.888.882 1.503 1.5.368.368.797.8 1.326 1.328'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M21 12.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0m-1.5 0a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgSuccess;
