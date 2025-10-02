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
const SvgCommonOperatingPic = ({
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
      d='M3 5.583A2.583 2.583 0 0 1 5.583 3h12.834A2.583 2.583 0 0 1 21 5.583v9.167a2.583 2.583 0 0 1-2.583 2.583h-3.394l.404 1.617.77.77a.75.75 0 0 1-.53 1.28H8.333a.75.75 0 0 1-.53-1.28l.77-.77.404-1.617H5.583A2.583 2.583 0 0 1 3 14.75zm1.5 8.084v1.083c0 .598.485 1.083 1.083 1.083h12.834c.598 0 1.083-.485 1.083-1.083v-1.083zm15-1.5h-15V5.583c0-.598.485-1.083 1.083-1.083h12.834c.598 0 1.083.485 1.083 1.083zm-6.023 5.166h-2.954L9.981 19.5h4.038z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgCommonOperatingPic;
