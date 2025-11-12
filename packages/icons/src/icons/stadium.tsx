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
const SvgStadium = ({
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
      d='M21 12.889v4.444C21 18.844 16.744 20 11.867 20c-1.241 0-2.483-.089-3.547-.267v-2.4l-3.547-.889v2.49C3.621 18.488 3 17.955 3 17.333V11.11c0-.889 1.773-1.778 3.547-1.778 5.32 0 7.093 4.89 11.527 4.89 1.773 0 2.926-1.334 2.926-1.334M5.66 8l3.547.889V6.222L5.66 5.333zm11.527-1.333 3.547.889V4.889L17.187 4zM21 10.489C21 9.6 20.29 8 17.808 8s-4.7 2.4-4.788 2.578c1.596 1.155 2.837 2.31 5.054 2.31 2.926 0 2.926-2.4 2.926-2.4'
    />
  </svg>
);
export default SvgStadium;
