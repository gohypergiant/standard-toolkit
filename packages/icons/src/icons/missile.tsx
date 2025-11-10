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
const SvgMissile = ({
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
      d='m13.73 15.9 3.54-.23v-1.66l-3.54-.81V4.41c0-.06 0-1.12-.11-1.62-.16-.72-1.04-1.8-1.48-1.8-.49 0-1.32 1.11-1.48 1.8-.13.57-.12 1.23-.12 1.54v8.86L7 14.02v1.64l3.54.23.07 2.1.33 2.4-1.88 1.11c-.06.06-.06 1 0 1.04.86.08 1.73.07 2.58.19.01.14-.02.28.15.3.09.01.7.01.76 0 .08-.03.07-.22.1-.3l.07-.03 2.5-.13v-1.06l-1.91-1.09.37-2.4.07-2.1z'
    />
  </svg>
);
export default SvgMissile;
