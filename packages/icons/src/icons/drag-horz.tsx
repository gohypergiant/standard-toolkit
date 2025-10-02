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
const SvgDragHorz = ({
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
      d='M19.626 13c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m-9 2c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2m-7 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2m4-6c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2m3 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2m7 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2'
    />
  </svg>
);
export default SvgDragHorz;
