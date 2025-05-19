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
const SvgTrackHistory = ({
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
      d='M14.779 19.405a5 5 0 1 0 0-10 5 5 0 0 0 0 10m0 1.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='m3.452 3.706 4.945 4.901-2.644 1.527-1.974-.976-1.058.61 2.056 2.34.998 2.95 1.057-.611.142-2.198.767-.443a7.5 7.5 0 0 1 8.302-4.795c.724-.465 1.72-1.721 1.426-2.231-.305-.53-1.999-.256-2.726.163L11.57 6.775l-7.06-3.68z'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='m13.601 10.656 1.5.001-.004 3.605 2.757 2.531-1.015 1.105-3.243-2.977z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgTrackHistory;
