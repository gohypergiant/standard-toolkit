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
const SvgMessage = ({
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
      d='m18.232 19.19-.344-2.843C19.775 14.997 21 12.846 21 10.416 21 6.32 17.518 3 13.215 3 9.53 3 6.445 5.439 5.642 8.715c-.08.342.238.648.564.54a6.2 6.2 0 0 1 2.01-.324c3.404 0 6.172 2.682 6.172 5.976l1.469 1.44c.626.387 2.463 3.59 2.375 2.844'
    />
    <path
      fill='currentColor'
      d='M13.065 14.907a4.43 4.43 0 0 1-1.04 2.844c-.873 1.08-2.257 1.772-3.809 1.772L7.041 19.5c-.388.243-2.007 1.328-1.955.87l.22-1.774c-1.18-.836-1.939-2.177-1.939-3.69 0-1.583.83-2.978 2.099-3.806a4.94 4.94 0 0 1 2.75-.82c2.68 0 4.85 2.07 4.85 4.627'
    />
  </svg>
);
export default SvgMessage;
