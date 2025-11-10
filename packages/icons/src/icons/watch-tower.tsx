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
const SvgWatchTower = ({
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
      d='M6.763 10.818h1.222L6.04 20.306H4V22h16v-1.694h-2.061l-1.945-9.488h1.222V4.662L12 2 6.763 4.661zm7.765 1.025L12 14.425 9.47 11.84l.201-1.022h4.62zm-3.688 3.773-1.76-1.794-.932 4.53zM12 16.808l3.417 3.498H8.583zm3.873 1.544-2.692-2.736 1.76-1.794zM15.5 6h-1.517v1.5H15.5zm-5.462 0H8.5v1.5h1.538z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgWatchTower;
