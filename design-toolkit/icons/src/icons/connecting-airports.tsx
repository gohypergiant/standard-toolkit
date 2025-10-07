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
const SvgConnectingAirports = ({
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
      d='M6.5 8.5 5 3h1l3.5 5.5h3c.688 0 2 .5 2 1s-1.312 1-2 1h-3L6 16H5l1.5-5.5H4L3 12H2l.5-2.5L2 7h1l1 1.5zM17 15.5l1.5 5.5h-1L14 15.5h-3c-.687 0-2-.5-2-1s1.313-1 2-1h3L17.5 8h1L17 13.5h3l1.5-1.5h.5l-.5 2.5.5 2.5h-.5L20 15.5z'
    />
  </svg>
);
export default SvgConnectingAirports;
