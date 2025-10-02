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
const SvgRecord = ({
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
      d='M12.626 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16M6.759 9.333h2.134A1.067 1.067 0 0 1 9.959 10.4v1.067c0 .533-.405.96-.917 1.034l1.248 2.166H9.053l-1.227-2.134v2.134H6.759m5.334-5.334h2.133V10.4h-2.133v1.067h2.133v1.066h-2.133V13.6h2.133v1.067h-2.133a1.066 1.066 0 0 1-1.067-1.067v-3.2a1.067 1.067 0 0 1 1.067-1.067m4.266 0h2.134V10.4h-2.134v3.2h2.134v1.067h-2.134a1.066 1.066 0 0 1-1.066-1.067v-3.2a1.066 1.066 0 0 1 1.066-1.067M7.826 10.4v1.067h1.067V10.4'
    />
  </svg>
);
export default SvgRecord;
