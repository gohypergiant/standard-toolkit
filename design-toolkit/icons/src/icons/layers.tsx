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
const SvgLayers = ({
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
      d='m11.639 15.947-8.093-4.94a.94.94 0 0 1-.394-.379 1.15 1.15 0 0 1-.148-.567c0-.202.051-.4.148-.567a.94.94 0 0 1 .394-.38l8.096-5.032a.79.79 0 0 1 .698 0l8.118 5.032c.16.08.298.211.394.38.097.168.148.365.148.567s-.051.399-.148.567a.94.94 0 0 1-.394.38l-8.12 4.939a.8.8 0 0 1-.7 0'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='M19.759 13.233 11.989 18l-7.744-4.767c-1.241-.553-1.676.97-.741 1.447l8.136 4.864a.8.8 0 0 0 .699 0L20.5 14.68c1.016-.519.5-2-.741-1.447'
    />
  </svg>
);
export default SvgLayers;
