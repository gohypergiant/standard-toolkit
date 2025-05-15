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
const SvgConnection = ({
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
      d='M13.768 5.075q1.06-1.06 2.121 0l3.536 3.536q1.06 1.06 0 2.121l-3.182 3.182-5.657-5.657zM10.232 19.925q-1.06 1.06-2.121 0l-3.536-3.536q-1.06-1.06 0-2.121l3.182-3.182 5.657 5.657z'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='m2.984 20.455 3.536-3.536 1.06 1.061-3.535 3.536zM7.934 12.677l2.475-2.475 1.06 1.06-2.474 2.475zM10.763 15.505l2.474-2.475 1.061 1.061-2.475 2.475zM16.42 7.02l3.535-3.536 1.06 1.061-3.535 3.536z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgConnection;
