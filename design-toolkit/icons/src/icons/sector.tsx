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
const SvgSector = ({
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
      d='M3 19.5v.259C3 20.421 3.546 21 4.242 21H4.5l5.625-.003V21h3.75v-1.5H12V12H4.5v-1.875H3v3.75h.002zm8-1.45L8.2 13.5l-1.12 1.819.296.606a.75.75 0 0 1-1.348.657l-.567-1.163L4 18.05z'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='M3 6.375h1.5V4.5h1.875V3H4.5A1.5 1.5 0 0 0 3 4.5zM10.125 3v1.5h3.75V3zM17.625 3v1.5H19.5v1.875H21V4.5A1.5 1.5 0 0 0 19.5 3zM21 10.125h-1.5v3.75H21zM21 17.625h-1.5V19.5h-1.875V21H19.5a1.5 1.5 0 0 0 1.5-1.5z'
    />
  </svg>
);
export default SvgSector;
