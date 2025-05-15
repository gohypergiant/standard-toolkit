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
const SvgKebab = ({
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
      d='M11.996 7.012a2 2 0 0 0 1.996-2.006A2 2 0 0 0 11.996 3 2 2 0 0 0 10 5.006a2 2 0 0 0 1.996 2.006M11.996 14.012a2 2 0 0 0 1.996-2.006A2 2 0 0 0 11.996 10 2 2 0 0 0 10 12.006a2 2 0 0 0 1.996 2.006M11.996 21.012a2 2 0 0 0 1.996-2.006A2 2 0 0 0 11.996 17 2 2 0 0 0 10 19.006a2 2 0 0 0 1.996 2.006'
    />
  </svg>
);
export default SvgKebab;
