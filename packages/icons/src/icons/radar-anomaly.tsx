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
const SvgRadarAnomaly = ({
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
      d='M8.908 9.506 6.98 13.341h-3.87A9.4 9.4 0 0 1 3.003 12c0-4.97 4.032-9.002 9.002-9.002a8.994 8.994 0 0 1 8.992 9.011c0 .46-.045.9-.108 1.341h-3.861l-3.052-7.327-2.692 7.957zm5.257 1.612 1.674 4.024h4.591c-1.278 3.42-4.564 5.86-8.426 5.86s-7.147-2.44-8.426-5.86h4.52l.864-1.72 2.7 5.086z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgRadarAnomaly;
