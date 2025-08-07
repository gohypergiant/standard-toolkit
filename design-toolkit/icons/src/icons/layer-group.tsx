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
const SvgLayerGroup = ({
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
      d='M3 17.25v2.25c0 1.105.395 1.5 1.5 1.5h2.25v-1.5H4.5v-2.25zm0-3.5h1.5v-3.5H3zm0-7h1.5V4.5h2.25V3H4.5C3.395 3 3 3.395 3 4.5zM10.25 3v1.5h3.5V3zm7 0v1.5h2.25v2.25H21V4.5c0-1.105-.395-1.5-1.5-1.5zM21 10.25h-1.5v3.5H21zm0 7h-1.5v2.25h-2.25V21h2.25c1.105 0 1.5-.395 1.5-1.5zM13.75 21v-1.5h-3.5V21zM11.639 15.447l-5.093-3.94a.94.94 0 0 1-.394-.379 1.15 1.15 0 0 1-.148-.567c0-.202.051-.4.148-.567a.94.94 0 0 1 .394-.38l5.096-4.032a.79.79 0 0 1 .698 0l5.118 4.032c.16.08.298.211.394.38.097.168.148.365.148.567s-.051.399-.148.567a.94.94 0 0 1-.394.38l-5.12 3.939a.8.8 0 0 1-.7 0m-4.135-4.894L11.99 7l4.51 3.553L11.99 14z'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='m16.759 13.106-4.77 3.768-4.744-3.768c-1.241-.553-1.676.97-.741 1.447l5.136 3.865a.79.79 0 0 0 .699 0l5.161-3.865c1.016-.518.5-2-.741-1.447'
    />
  </svg>
);
export default SvgLayerGroup;
