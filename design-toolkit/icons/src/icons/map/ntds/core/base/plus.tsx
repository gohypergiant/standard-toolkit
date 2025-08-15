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
const SvgPlus = ({
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
      d='M15.637 2v6.363H22v7.274h-6.363V22H8.363v-6.363H2V8.363h6.363V2zm-5.455 18.182h3.636v-3.636h-3.636zm-6.364-6.364h3.636v-3.636H3.818zm6.364 0h3.636v-3.636h-3.636zm6.364 0h3.636v-3.636h-3.636zm-6.364-6.364h3.636V3.818h-3.636z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgPlus;
