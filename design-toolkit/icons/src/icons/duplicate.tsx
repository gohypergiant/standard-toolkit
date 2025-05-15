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
const SvgDuplicate = ({
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
      d='M3 10v9.25c0 1.1.65 1.75 1.75 1.75H16v-1.5H4.5V10zm3-5.25v11.5c0 1.1.65 1.75 1.75 1.75h11.5c1.1 0 1.75-.65 1.75-1.75V4.75C21 3.65 20.35 3 19.25 3H7.75C6.65 3 6 3.65 6 4.75m13.5-.25v12h-12v-12z'
    />
    <path fill='currentColor' d='M17.5 9.5v2h-3v3h-2v-3h-3v-2h3v-3h2v3z' />
  </svg>
);
export default SvgDuplicate;
