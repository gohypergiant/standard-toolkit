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
const SvgSensorHealth = ({
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
      d='M13.311 13.258 8.024 3C5.14 4.365 3.801 9.763 6.258 12.844c1.766 2.214 3.74 2.897 5.4 2.985-.13.458-.2.942-.2 1.442 0 .653.119 1.28.336 1.857H4.5c-1.5 0-1.5 1.081-1.5 1.5h9.665a5.271 5.271 0 1 0 .647-7.37m4.645.945h-2.454v1.84h-1.84v2.455h1.84v1.841h2.454v-1.841h1.841v-2.454h-1.84z'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='m12.26 7.134 1.664-.855 1.285 2.495-1.664.854zM4.5 18.628l1.5-5c.833 1.5 3 2.5 3 2.5v2.5z'
    />
  </svg>
);
export default SvgSensorHealth;
