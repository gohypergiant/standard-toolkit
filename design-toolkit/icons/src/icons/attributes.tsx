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
const SvgAttributes = ({
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
      d='M18.3 4.8h-3.762C14.16 3.756 13.17 3 12 3s-2.16.756-2.538 1.8H5.7c-.99 0-1.8.81-1.8 1.8v12.6c0 .99.81 1.8 1.8 1.8h12.6c.99 0 1.8-.81 1.8-1.8V6.6c0-.99-.81-1.8-1.8-1.8m-5.4 13.5h-1.8v-1.8h1.8zm0-3.6h-1.8V9.3h1.8zM12 6.6a.903.903 0 0 1-.9-.9c0-.495.405-.9.9-.9s.9.405.9.9-.405.9-.9.9'
    />
  </svg>
);
export default SvgAttributes;
