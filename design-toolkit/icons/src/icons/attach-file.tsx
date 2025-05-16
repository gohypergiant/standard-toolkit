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
const SvgAttachFile = ({
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
      d='M15.5 7v9c0 3.5-3.75 3.5-3.75 3.5S8 19.5 8 16V7c0-2.5 2.25-2.5 2.25-2.5s2.25 0 2.25 2.5v8.5c0 1-.75 1-.75 1s-.75 0-.75-1V7H9.5v9c0 2 2.25 2 2.25 2S14 18 14 16V7c0-4-3.75-4-3.75-4S6.5 3 6.5 7v9c0 5 5.25 5 5.25 5S17 21 17 16V7z'
    />
  </svg>
);
export default SvgAttachFile;
