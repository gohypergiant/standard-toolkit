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
const SvgDiamond = ({
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
    <path fill='#FF69B4' d='M13 23h-2v-4h2zM14 12l-2 2-2-2 2-2z' />
    <path
      fill='#FF69B4'
      fillRule='evenodd'
      d='m18 12-6 6-6-6 6-6zM8 12l4 4 4-4-4-4z'
      clipRule='evenodd'
    />
    <path
      fill='#FF69B4'
      d='M23 11v2h-4v-2zM5 12v1H1v-2h4zM13 5h-2V1h2zM12 10l2 2-2 2-2-2z'
    />
  </svg>
);
export default SvgDiamond;
