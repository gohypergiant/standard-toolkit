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
const SvgLockOutline = ({
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
      d='M19.5 8H17c0-6-5-6-5-6S7 2 7 8H4.5S3 8 3 9.5v10S3 21 4.5 21h15c1.5 0 1.5-1.5 1.5-1.5v-10C21 8 19.5 8 19.5 8M12 3.5s3.5 0 3.5 4.5h-7c0-4.5 3.5-4.5 3.5-4.5m7.5 15.899-15 .101v-10h15z'
    />
    <path
      fill='currentColor'
      d='M14 14.5c0 2-2 2-2 2s-2 0-2-2 2-2 2-2 2 0 2 2'
    />
  </svg>
);
export default SvgLockOutline;
