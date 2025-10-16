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
const SvgWaffle = ({
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
      d='M18.3 3A2.7 2.7 0 0 1 21 5.7v12.6a2.7 2.7 0 0 1-2.7 2.7H5.7A2.7 2.7 0 0 1 3 18.3V5.7A2.7 2.7 0 0 1 5.7 3zM4.8 12.785V18.3a.9.9 0 0 0 .9.9h5.4v-6.415zm8.1 0V19.2h5.4a.9.9 0 0 0 .9-.9v-5.515zM5.7 4.8a.9.9 0 0 0-.9.9v5.285h6.3V4.8zm7.2 6.185h6.3V5.7a.9.9 0 0 0-.9-.9h-5.4z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgWaffle;
