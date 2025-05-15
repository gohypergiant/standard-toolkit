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
const SvgTicket = ({
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
      d='M15 8.5v1h1.5v-1zM15 10.5v1h1.5v-1zM15 12.5v1h1.5v-1zM15 14.5v1h1.5v-1z'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M20 12a2 2 0 0 1 2-2V7a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v3a2 2 0 1 1 0 4v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-3a2 2 0 0 1-2-2M3.5 8.837V7.5h17v1.337a3.5 3.5 0 0 0 0 6.326V16.5h-17v-1.337a3.5 3.5 0 0 0 0-6.326'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgTicket;
