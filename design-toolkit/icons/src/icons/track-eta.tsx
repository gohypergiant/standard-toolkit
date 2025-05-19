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
const SvgTrackEta = ({
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
      d='M17.503 10.5h-3.5V7h-3v3.5h-3.5v3h3.5V17h3v-3.5h3.5z'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='m5.789 7.228 1.06 1.061-3.712 3.712 3.713 3.713-1.061 1.06-3.89-3.889c-.532-.533-.533-1.234 0-1.767zM18.276 16.775l-1.06-1.061L20.926 12 17.215 8.29l1.06-1.06 3.89 3.889c.533.532.533 1.234 0 1.767z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgTrackEta;
