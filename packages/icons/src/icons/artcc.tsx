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
const SvgArtcc = ({
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
      d='m20 9-1 2h-3l-1-2 1-1h1V7h1v1h1zm1 10.5v.5H3v-.5C3 18 4.5 18 4.5 18H16v-6h3v6h.5c1.5 0 1.5 1.5 1.5 1.5M17.862 3.652a1.22 1.22 0 0 0-1.643-.464L12.653 5.1 5.79 3.06A.8.8 0 0 0 5.498 3a.726.726 0 0 0-.733.72c0 .209.092.397.236.528l.005.004a1 1 0 0 0 .102.075l3.75 2.808-2.16 1.156-2.827-.583a.6.6 0 0 0-.249-.05.617.617 0 0 0-.622.61c0 .155.057.294.153.4l.002.003q.057.065.132.11L4.727 10h3.706l9.002-4.88c.528-.289.722-.945.427-1.468'
    />
  </svg>
);
export default SvgArtcc;
