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
const SvgPlaceholder = ({
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
      d='M2 17.714V20a2 2 0 0 0 2 2h2.286v-2H4v-2.286zM6.286 2H4a2 2 0 0 0-2 2v2.286h2V4h2.286zM2 14.286h2V9.714H2zM9.714 2v2h4.572V2zm8 0v2H20v2.286h2V4a2 2 0 0 0-2-2zM22 9.714h-2v4.572h2zm0 8h-2V20h-2.286v2H20a2 2 0 0 0 2-2zM14.286 22v-2H9.714v2z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgPlaceholder;
