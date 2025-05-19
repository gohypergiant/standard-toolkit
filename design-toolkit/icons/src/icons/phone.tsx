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
const SvgPhone = ({
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
      d='M17.815 15.124c-1.02 2.444-3.41 2.873-4.191 2.873-.23 0-3.802.19-8.938-4.682C.553 9.395.048 5.179.004 4.378-.038 3.598.185 1.64 2.877.186c.334-.18.995-.26 1.166-.09.076.077 2.336 3.795 2.395 3.918q.09.185.09.363 0 .256-.364.637a6 6 0 0 1-.79.7 8 8 0 0 0-.79.676q-.363.357-.363.586c.017.397.342 1.817 2.818 3.993s3.669 2.789 3.783 2.831a.9.9 0 0 0 .287.063q.23 0 .586-.362c.237-.242 1.037-1.338 1.292-1.58q.382-.363.637-.363.179 0 .363.089c.123.06 3.846 2.238 3.917 2.31.194.199.057.817-.089 1.167'
    />
  </svg>
);
export default SvgPhone;
