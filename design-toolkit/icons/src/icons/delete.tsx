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
const SvgDelete = ({
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
    <g fill='currentColor'>
      <path d='M7 4.5S7 3 8.5 3h7C17 3 17 4.5 17 4.5V7h3v1.5h-1l-1 11c-.067 1.008-.5 1.5-1.5 1.5H8c-1.5 0-1.823-.539-2-2L5 8.5H4V7h3zM8.5 7h7V4.5h-7zm-2 1.5 1 11h9l1-11zM11 11v6H9.5v-6z' />
      <path d='M14.5 17v-6H13v6z' />
    </g>
  </svg>
);
export default SvgDelete;
