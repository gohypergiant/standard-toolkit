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
const SvgJumpTo = ({
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
      d='m20.87 12.828-8.042 8.043c-.928.928-1.857 0-1.857 0l-8.043-8.043c-.928-.929 0-1.857 0-1.857l8.043-8.043c.928-.928 1.857 0 1.857 0l8.043 8.043s.928.928 0 1.857m-17.014-.929 8.044 8.044 8.043-8.044-8.044-8.043z'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='M10.008 11h2.996L13 8l4.5 4-4.5 4v-3h-2.992l-.01 1.5s0-1 .002 0H8c0-2-.003 0-.003 0V14c0-.505.003-.5.003-.5V13c0-2 2.008-2 2.008-2'
    />
  </svg>
);
export default SvgJumpTo;
