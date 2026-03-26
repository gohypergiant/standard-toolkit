/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
const SvgFullScreen = ({
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
    <g fill='currentColor'>
      <path d='m5.532 17.739 3.342-3.341.73.728-3.343 3.343 4.072.002V19.5H4.5v-5.833h1.035zM19.5 19.5h-5.833v-1.029l4.072-.002-3.342-3.343.729-.728 3.342 3.34-.003-4.071H19.5zM10.333 5.529l-4.072.002 3.342 3.343-.729.729L5.532 6.26l.003 4.072H4.5V4.5h5.833zM19.5 10.333h-1.035l.003-4.072-3.342 3.342-.73-.729 3.343-3.343-4.072-.002V4.5H19.5z' />
    </g>
  </svg>
);
export default SvgFullScreen;
