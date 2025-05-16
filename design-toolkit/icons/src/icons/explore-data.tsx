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
const SvgExploreData = ({
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
      d='M6.715 4.285 5.5 1 4.285 4.285 1 5.5l3.285 1.215L5.5 10l1.215-3.285L10 5.5z'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M10.72 16.298 5 22l1.49 1.49 5.652-5.756A6.46 6.46 0 0 0 15.99 19a6.5 6.5 0 1 0-6.5-6.5c0 1.414.455 2.727 1.23 3.798m1.195 1.261.227.175a7 7 0 0 1-.382-.304zm-1.196-1.261q.082.113.168.222zm.341.432-.173-.21q.084.106.173.21M15.99 8c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5S18.48 8 15.99 8'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgExploreData;
