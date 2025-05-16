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
const SvgFlightPlan = ({
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
      d='m10.027 11.244-1.263 1.278a6.6 6.6 0 0 1-1.59-2.646l1.724-.441c.284.801.684 1.35 1.129 1.809M11.11 6.6 7.556 3 4 6.6h2.684c.018.729.072 1.386.17 1.953l1.724-.441A12 12 0 0 1 8.462 6.6zM20 6.6 16.444 3 12.89 6.6h2.658c-.09 3.312-1.138 4.275-2.258 5.292-.445.396-.898.828-1.289 1.395a6.4 6.4 0 0 0-1.004-1.116L9.742 13.44c.827.765 1.37 1.386 1.37 3.06V21h1.777v-4.5c0-1.818.631-2.394 1.591-3.267 1.227-1.116 2.738-2.502 2.844-6.633z'
    />
  </svg>
);
export default SvgFlightPlan;
