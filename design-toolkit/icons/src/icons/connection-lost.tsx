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
const SvgConnectionLost = ({
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
      d='M13.945 4.899q.883-.884 1.944.176l3.536 3.536q1.06 1.06.176 1.944l-2.651 2.652-5.657-5.657zM10.056 20.101q-.885.884-1.945-.176l-3.536-3.536q-1.06-1.06-.176-1.944l2.651-2.652 5.657 5.657z'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='m2.984 20.455 3.536-3.536 1.06 1.061-3.535 3.536zM7.227 13.384l1.414-1.414 1.061 1.06-1.414 1.415zM10.056 16.212l1.414-1.414 1.06 1.06-1.414 1.415zM4.752 4.191l15.556 15.557-1.06 1.06L3.69 5.252zM16.42 7.02l3.535-3.536 1.06 1.061-3.535 3.536z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgConnectionLost;
