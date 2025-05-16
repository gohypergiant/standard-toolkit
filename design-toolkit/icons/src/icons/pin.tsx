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
const SvgPin = ({
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
      d='M7.375 3.165A.6.6 0 0 1 7.8 3h8.4c.16 0 .312.06.424.165a.55.55 0 0 1 .176.397c0 .764-.41 1.32-.776 1.664-.15.14-.3.252-.424.335v4.986q.529.298.996.678c.634.522 1.404 1.368 1.404 2.462 0 .15-.063.292-.176.398a.62.62 0 0 1-.424.165h-4.8v5.063c0 .31-.27 1.687-.6 1.687s-.6-1.378-.6-1.687V14.25H6.6a.62.62 0 0 1-.424-.165.55.55 0 0 1-.176-.398c0-1.094.769-1.94 1.404-2.462q.466-.38.996-.678V5.56a3.3 3.3 0 0 1-.425-.334c-.364-.343-.775-.9-.775-1.665 0-.148.063-.291.175-.397'
    />
  </svg>
);
export default SvgPin;
