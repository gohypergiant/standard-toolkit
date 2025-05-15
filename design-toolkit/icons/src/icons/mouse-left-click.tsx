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
const SvgMouseLeftClick = ({
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
      d='M12 2C8.414 2 5 3.975 5 8v8a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6V8c0-4.025-3.414-6-7-6m5.5 14v-5.006q-.34.113-.818.233c-1.058.265-2.619.523-4.682.523s-3.624-.258-4.682-.523q-.478-.122-.818-.233V16a4.5 4.5 0 0 0 4.5 4.5h2a4.5 4.5 0 0 0 4.5-4.5m0-8v1.4l-.138.054c-.225.084-.572.2-1.044.318-.816.204-2.005.413-3.568.465V3.534c1.243.116 2.36.518 3.183 1.147.94.721 1.567 1.785 1.567 3.319'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgMouseLeftClick;
