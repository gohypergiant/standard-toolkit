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
const SvgMute = ({
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
      d='M19.809 17.945 8.364 6.36 5.945 3.914 4.75 5.086l2.635 2.585v.009c-.49.914-.753 1.994-.753 3.157v4.615L4.75 17.3v.922h12.922l1.883 1.847 1.195-1.173zM12.279 21c1.045 0 1.883-.822 1.883-1.846h-3.765c0 1.024.838 1.846 1.882 1.846m5.648-6.757v-3.397c0-2.843-1.544-5.206-4.236-5.834V3h-2.823v2.012c-.142.028-.273.074-.396.111a3 3 0 0 0-.282.102h-.01c-.009 0-.009 0-.018.009a8 8 0 0 0-.64.286s-.01 0-.01.01z'
    />
  </svg>
);
export default SvgMute;
