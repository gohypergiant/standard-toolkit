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
const SvgData = ({
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
      d='M12 2C6.78 2 2.54 4.05 2.54 6.58v10.84C2.54 19.95 6.78 22 12 22s9.46-2.05 9.46-4.58V6.58C21.46 4.05 17.22 2 12 2m7.89 13.07v2.35c0 .54-.68 1.21-1.82 1.78-1.57.78-3.78 1.23-6.06 1.23s-4.5-.45-6.06-1.23c-1.14-.57-1.82-1.24-1.82-1.78v-2.89l.46.28c1.82 1.12 4.53 1.77 7.43 1.77s5.61-.64 7.43-1.77l.46-.28v.54zm0-5.42V12c0 .54-.68 1.21-1.82 1.78-1.57.78-3.78 1.23-6.06 1.23s-4.5-.45-6.06-1.23c-1.14-.57-1.82-1.24-1.82-1.78V9.11l.46.28c1.82 1.12 4.53 1.77 7.43 1.77s5.61-.64 7.43-1.77l.46-.28v.54zm-1.83-1.29c-1.57.78-3.78 1.23-6.06 1.23s-4.5-.45-6.06-1.23C4.8 7.79 4.12 7.12 4.12 6.58S4.8 5.37 5.94 4.8C7.51 4.02 9.72 3.57 12 3.57s4.5.45 6.06 1.23c1.14.57 1.82 1.24 1.82 1.78s-.68 1.21-1.82 1.78'
    />
  </svg>
);
export default SvgData;
