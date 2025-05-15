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
const SvgLive = ({
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
      d='M14 12.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0M5.636 6.136A8.97 8.97 0 0 0 3 12.5a8.97 8.97 0 0 0 2.636 6.364l1.06-1.061A7.48 7.48 0 0 1 4.5 12.5c0-2.071.84-3.946 2.197-5.304zM17.303 7.196l1.061-1.06A8.97 8.97 0 0 1 21 12.5a8.97 8.97 0 0 1-2.636 6.364l-1.06-1.061A7.48 7.48 0 0 0 19.5 12.5c0-2.071-.84-3.946-2.197-5.304'
    />
    <path
      fill='currentColor'
      d='M8.11 8.61A5.48 5.48 0 0 0 6.5 12.5c0 1.518.616 2.893 1.61 3.889l.973-.973A4.1 4.1 0 0 1 7.875 12.5c0-1.14.462-2.17 1.208-2.917zM14.917 9.583l.972-.972A5.48 5.48 0 0 1 17.5 12.5a5.48 5.48 0 0 1-1.61 3.889l-.973-.973a4.1 4.1 0 0 0 1.208-2.916c0-1.14-.462-2.17-1.208-2.917'
    />
  </svg>
);
export default SvgLive;
