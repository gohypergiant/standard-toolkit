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
const SvgSkull = ({
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
      d='M17.75 17.062a8 8 0 1 0-11.5 0v3.188h11.5zm-.626-1.562s-.182.246-.874 1v2.25H14.5V17H13v1.75h-2V17H9.5v1.75H7.75V16.5c-.727-.8-.874-1-.874-1a6.5 6.5 0 1 1 10.248 0'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='m12 12 1.75 3h-3.5zM10 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M17 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0'
    />
  </svg>
);
export default SvgSkull;
