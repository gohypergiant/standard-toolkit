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
const SvgCircle = ({
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
    <path fill='#FF69B4' d='m12 10 2 2-2 2-2-2z' />
    <path
      fill='#FF69B4'
      fillRule='evenodd'
      d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10m0-2.727a7.25 7.25 0 0 0 2.833-.573V5.3A7.25 7.25 0 0 0 12 4.727c-.97 0-1.897.19-2.744.536v13.474a7.3 7.3 0 0 0 2.744.536M7.861 17.98V6.02A7.27 7.27 0 0 0 4.727 12a7.27 7.27 0 0 0 3.134 5.981M19.273 12c0 2.44-1.202 4.6-3.045 5.918V6.082A7.26 7.26 0 0 1 19.273 12'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgCircle;
