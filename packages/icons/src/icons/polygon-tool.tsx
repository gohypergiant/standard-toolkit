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
const SvgPolygonTool = ({
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
      d='m19.453 9.27-7.16-5.202a.5.5 0 0 0-.587 0l-7.16 5.201a.5.5 0 0 0-.181.56L7.1 18.244a.5.5 0 0 0 .475.345h8.85a.5.5 0 0 0 .475-.345l2.735-8.417a.5.5 0 0 0-.182-.559m-6.277-6.416a2 2 0 0 0-2.352 0L3.665 8.056a2 2 0 0 0-.727 2.236l2.735 8.416a2 2 0 0 0 1.902 1.382h8.85a2 2 0 0 0 1.902-1.382l2.734-8.416a2 2 0 0 0-.726-2.236z'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='M14 3.375a2 2 0 1 1-4 0 2 2 0 0 1 4 0M19.125 18.875a2 2 0 1 1-4 0 2 2 0 0 1 4 0M8.5 18.875a2 2 0 1 1-4 0 2 2 0 0 1 4 0M22.375 9.281a2 2 0 1 1-4 0 2 2 0 0 1 4 0M5.875 9.281a2 2 0 1 1-4 0 2 2 0 0 1 4 0'
    />
  </svg>
);
export default SvgPolygonTool;
