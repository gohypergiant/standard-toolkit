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
const SvgNewspaper = ({
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
      d='M5.8 20.2q-.743 0-1.271-.529A1.73 1.73 0 0 1 4 18.4V4l1.508 1.508L6.992 4 8.5 5.508 10.008 4l1.485 1.508L13 4l1.508 1.508L15.993 4 17.5 5.508 19.008 4l1.485 1.508L22 4v14.4q0 .743-.529 1.271a1.73 1.73 0 0 1-1.271.529zm0-1.8h6.3V13H5.8zm8.1 0h6.3v-1.8h-6.3zm0-3.6h6.3V13h-6.3zm-8.1-3.6h14.4V8.5H5.8z'
    />
  </svg>
);
export default SvgNewspaper;
