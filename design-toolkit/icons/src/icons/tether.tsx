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
const SvgTether = ({
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
      d='M6.626 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m6 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m6-6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-6-6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m0 1.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m9-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgTether;
