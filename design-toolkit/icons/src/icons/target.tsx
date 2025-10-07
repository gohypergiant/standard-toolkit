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
const SvgTarget = ({
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
      d='M19.965 12.75a8 8 0 0 1-7.215 7.215V22h-1.5v-2.035a8 8 0 0 1-7.215-7.215H2v-1.5h2.035a8 8 0 0 1 7.215-7.215V2h1.5v2.035a8 8 0 0 1 7.215 7.215H22v1.5zM11.25 5.543V7.5h1.5V5.543a6.5 6.5 0 0 1 5.707 5.707H16.5v1.5h1.957a6.5 6.5 0 0 1-5.707 5.707V16.5h-1.5v1.957a6.5 6.5 0 0 1-5.707-5.707H7.5v-1.5H5.543a6.5 6.5 0 0 1 5.707-5.707'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgTarget;
