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
const SvgThreatAssess = ({
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
      d='m4.722 18.54 6.435-11.5 2.652 4.692 1.311-.616-3.07-5.646a1 1 0 0 0-1.72.04L3.158 18.54c-.375.667-.055 1.5.71 1.5h11.628c-.539-.411-1.001-.921-1.376-1.5z'
    />
    <path
      fill='currentColor'
      d='M11.907 10.5h-1.5l.25 4.54h1zM10.407 16.79s-.01-.75.75-.75c.74 0 .75.75.75.75s-.01.75-.75.75-.75-.75-.75-.75M17.5 11 14 12.727v2.091c0 2.397 1.35 4.638 3.5 5.182 2.15-.544 3.5-2.785 3.5-5.182v-2.09z'
    />
  </svg>
);
export default SvgThreatAssess;
