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
const SvgRectangleTool = ({
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
      d='M5.5 4h13C20 4 20 5.5 20 5.5v13c0 1.5-1.5 1.5-1.5 1.5h-13C4 20 4 18.5 4 18.5v-13S4 4 5.5 4m13 14.5v-13h-13v13z'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='M21.125 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0M21.125 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0M6.875 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0M6.875 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0'
    />
  </svg>
);
export default SvgRectangleTool;
