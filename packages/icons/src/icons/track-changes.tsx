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
const SvgTrackChanges = ({
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
      d='M11.25 3.03a9 9 0 1 0 7.114 2.606l-1.06 1.06a7.5 7.5 0 1 1-6.053-2.16v2.015a5.501 5.501 0 1 0 4.638 1.56l-.972.972a4.125 4.125 0 1 1-3.667-1.14v2.204A2.01 2.01 0 0 0 10 12c0 1.1.9 2 2 2s2-.9 2-2c0-.858-.456-1.594-1.25-1.877V3h-1.5z'
    />
  </svg>
);
export default SvgTrackChanges;
