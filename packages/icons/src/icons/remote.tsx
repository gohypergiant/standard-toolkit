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
const SvgRemote = ({
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
    <path fill='currentColor' d='M14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0' />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M3.908 10.749c-1.21.582-1.21 2.312 0 2.894L10 16.252c-.008-.007 1.5.749 2 .749s1.337-.43 2-.749l6.133-2.628c1.156-.598 1.156-2.256 0-2.854C17.816 9.452 13 7 13 7v5h-2V7zM7 12.5s1 0 1-.5-1-.5-1-.5-1 0-1 .5 1 .5 1 .5'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='M19.763 15.122 12.004 18.5l-7.76-3.378c-1.24-.553-1.675.97-.74 1.447l8.147 3.349a.79.79 0 0 0 .698 0l8.155-3.35c1.016-.518.5-2-.741-1.446'
    />
  </svg>
);
export default SvgRemote;
