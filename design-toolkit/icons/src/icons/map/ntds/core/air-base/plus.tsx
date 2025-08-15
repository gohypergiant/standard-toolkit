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
      d='m15.637 4.121 2.02-2.02L21.9 6.343l-2.02 2.02H22v7.274h-6.363V22H8.363v-2.121l-2.02 2.02L2.1 17.657l2.02-2.02H2V8.363h6.363V2h7.274zm-5.455 13.94v2.12h3.636v-3.635h-2.122zm-5.253-.404 1.414 1.414L19.07 6.343l-1.414-1.414zm-1.11-3.839h2.12l1.515-1.514v-2.122H3.818zm12.727-2.122v2.122h3.636v-3.636H18.06zm-6.364-4.242h2.122l1.514-1.515V3.82h-3.636z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgPlus;
