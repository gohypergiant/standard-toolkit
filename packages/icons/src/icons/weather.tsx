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
const SvgWeather = ({
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
      d='M7.194 13.898c-.004 1.402.753 2.474 1.865 2.888L4.38 16.77c-1.815 0-2.374-1.699-2.38-2.474 0-2.024 1.658-3.664 3.704-3.665C6.51 8.719 8.294 7 10.52 7c.652 0 2.038.252 3.229 1.363a3.59 3.59 0 0 0-3.018 2.093c-1.749 0-3.538 1.194-3.538 3.442'
    />
    <path
      fill='currentColor'
      d='M10.706 16.768c-1.588-.157-2.823-1.366-2.823-2.833 0-1.574 1.421-2.85 3.175-2.85.691-1.489 2.328-2.535 4.236-2.535 2.192 0 4.025 1.38 4.48 3.225C21.047 12.02 22 13.036 22 14.252c0 1.4-1.264 2.534-2.823 2.534h-8.471z'
    />
  </svg>
);
export default SvgWeather;
