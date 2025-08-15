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
const SvgOutline = ({
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
      d='M14.727 14.727H9.273V9.273h5.454zm-4.545-.909h3.636v-3.636h-3.636z'
      clipRule='evenodd'
    />
    <path
      fill='#FF69B4'
      fillRule='evenodd'
      d='M22 22H2V2h20zM3.818 20.182h3.637v-3.636H3.818zM8.364 8.364H3.818v.909h4.546v5.454H3.818v.91h4.546v4.545h.909v-4.546h5.454v4.546h.91v-4.546h4.545v-.909h-4.546V9.273h4.546v-.91h-4.546V3.819h-.909v4.546H9.273V3.818h-.91zm1.818 11.818h3.636v-3.636h-3.636zm6.364 0h3.636v-3.636h-3.636zM3.818 13.818h3.637v-3.636H3.818zm12.728 0h3.636v-3.636h-3.636zM3.818 7.455h3.637V3.818H3.818zm6.364 0h3.636V3.818h-3.636zm6.364 0h3.636V3.818h-3.636z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgOutline;
