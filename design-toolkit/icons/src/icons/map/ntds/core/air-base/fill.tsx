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
const SvgFill = ({
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
      fill='#FF69B4'
      fillRule='evenodd'
      d='M22 22H2V2h20zM18.905 3.818 3.093 19.63l1.286 1.285L20.262 5.033l-1.215-1.215zm-8.723 13.866v2.498h3.636v-3.636H11.32zm6.364 2.498h3.636v-3.636h-3.636zM3.818 13.818h2.515l1.122-1.121v-2.515H3.818zm12.728-2.498v2.498h3.636v-3.636h-2.498zm-6.364-3.865h2.515l1.121-1.122V3.818h-3.636zm-6.364 0h3.637V3.818H3.818z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgFill;
