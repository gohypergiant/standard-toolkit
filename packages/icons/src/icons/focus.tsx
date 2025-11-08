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
const SvgFocus = ({
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
      d='M16.626 21v-1.5h3.5V16h1.5v3.5c0 1.5-1.5 1.5-1.5 1.5zm-8 0h-3.5c-1.5 0-1.5-1.5-1.5-1.5V16h1.5v3.5h3.5zm8-18h3.5c1.5 0 1.5 1.5 1.5 1.5V8h-1.5V4.5h-3.5zm-8 0v1.5h-3.5V8h-1.5V4.5s0-1.5 1.5-1.5h3.5M13.376 16.496l3.25-1.996v-4l-3.253 1.516zm-.75-5.996 3.5-1.5-3.5-2-4 2zm-4 4 3.252 1.996v-4.492L8.625 10.5zm8.84-6.504c.428.284.66.666.66 1.173v5.618c0 .506-.232.889-.66 1.173l-4.197 2.399q-.643.426-1.286 0L7.786 15.96c-.429-.284-.66-.667-.66-1.173V9.169c0-.507.231-.889.66-1.173l4.197-2.327c.214-.116.429-.169.643-.169s.429.053.643.169z'
    />
  </svg>
);
export default SvgFocus;
