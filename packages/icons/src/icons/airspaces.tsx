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
const SvgAirspaces = ({
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
      d='M12 6.167a5.8 5.8 0 0 1 2.5.561V3.667H5.75c-1.15 0-2.083.932-2.083 2.083v4.167H6.55A5.84 5.84 0 0 1 12 6.167M18.25 20.333h-2.5v-3.865A5.82 5.82 0 0 0 17.833 12c0-1.794-.81-3.398-2.083-4.468V3.667h2.5c1.15 0 2.083.932 2.083 2.083v12.5c0 1.15-.932 2.083-2.083 2.083M3.667 11.167h2.559q-.06.408-.06.833A5.83 5.83 0 0 0 9.5 17.272v3.061H5.75a2.083 2.083 0 0 1-2.083-2.083zM14.5 20.333h-3.75V17.7a5.86 5.86 0 0 0 3.75-.427z'
    />
    <path
      fill='currentColor'
      d='m14.56 15.393-2.48-2.48-2.53 2.53-.883-.884 2.53-2.53L8.667 9.5l.884-.884 2.53 2.53 2.478-2.48.884.884-2.479 2.48 2.48 2.479z'
    />
  </svg>
);
export default SvgAirspaces;
