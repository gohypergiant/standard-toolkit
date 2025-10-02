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
const SvgExpandLeftPanel = ({
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
      fill='#fff'
      fillRule='evenodd'
      d='M5.5 20h13c1.5 0 1.5-1.5 1.5-1.5v-13S20 4 18.5 4h-13S4 4 4 5.5v13S4 20 5.5 20m3-14.5h-3v13h3zm1.5 13h8.5v-13H10z'
      clipRule='evenodd'
    />
    <path
      fill='#fff'
      d='M11.814 12.575h2.98l-1.182 1.182a.58.58 0 0 0 0 .819.574.574 0 0 0 .813 0l2.168-2.168a.574.574 0 0 0 0-.813l-2.168-2.169a.574.574 0 1 0-.813.813l1.182 1.183h-2.98a.58.58 0 0 0-.576.576c0 .317.26.577.576.577'
    />
  </svg>
);
export default SvgExpandLeftPanel;
