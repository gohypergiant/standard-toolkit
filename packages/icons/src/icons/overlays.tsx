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
const SvgOverlays = ({
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
      d='M17 4.516a9 9 0 1 1-.027-.018L17 4.5zM14 19.23A7.5 7.5 0 0 1 5.412 8.412L12.5 15.5s0 1.5 1.5 1.5zm4.241-3.07A1.6 1.6 0 0 0 17.5 16v-1.5s0-1.5-1.5-1.5h-4v-2h1c1.5 0 1.5-1.5 1.5-1.5V8h1C17 8 17 6.5 17 6.5v-.09A7.48 7.48 0 0 1 19.5 12c0 1.54-.464 2.97-1.259 4.16'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgOverlays;
