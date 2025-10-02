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
const SvgRegion = ({
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
      d='M20.486 11.501a8.5 8.5 0 0 0-3.764-6.57v-.014l-.025-.002A8.5 8.5 0 1 0 14.88 20a25 25 0 0 1-1.076-1.148 7.083 7.083 0 0 1-8.025-10.24l5.725 5.726c.03-.711.205-1.385.496-1.99v-1.292h.891a5 5 0 0 1 1.417-1.046c.053-.212.053-.371.053-.371V8.222h.945c1.416 0 1.416-1.416 1.416-1.416V6.72a7.1 7.1 0 0 1 2.097 3.355 5 5 0 0 1 1.667 1.426'
    />
    <path
      fill='currentColor'
      d='M17.5 14.71c0 .582-.448 1.053-1 1.053s-1-.471-1-1.052.448-1.053 1-1.053 1 .471 1 1.053'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M16.482 18.75s2.504-2.25 2.504-4.25a2.5 2.5 0 0 0-5 0c0 2 2.496 4.25 2.496 4.25m.004 1.75s4-3 4-6a4 4 0 0 0-8 0c0 3 4 6 4 6'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgRegion;
