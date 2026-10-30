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
const SvgShorad = ({
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
      d='m1 15 4-3h6v-2h2V8H7V6.5h6V5h3v3h2V6h4v3.5h-3V12h2l2 2v4h-1a1.5 1.5 0 0 1-3 0h-2a1.5 1.5 0 0 1-3 0h-2a1.5 1.5 0 0 1-3 0H7a1.5 1.5 0 0 1-3 0H1Zm17.75-8.25h.75v.75h-.75Zm1.75 0h.75v.75h-.75ZM18.75 8h.75v.75h-.75Zm1.75 0h.75v.75h-.75Z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgShorad;
