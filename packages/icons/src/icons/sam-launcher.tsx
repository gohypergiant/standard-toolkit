/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
const SvgSamLauncher = ({
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
      d='m2 21 1.7-4H10v-3.344l-7.926-3.468 1.202-2.749 15.758 6.895.521-1.191L3.798 6.248 5 3.5l15.758 6.894L17.868 17H20.3l1.7 4h-1.8l-1.1-2.5H4.9L3.8 21Zm9.5-6.688V17h6.144Z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgSamLauncher;
