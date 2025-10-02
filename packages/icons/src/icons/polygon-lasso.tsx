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
const SvgPolygonLasso = ({
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
      d='m21.492 2-8.416 5.05H2.508l5.386 6.515c-.42.55-.67 1.237-.67 1.983a3.26 3.26 0 0 0 1 2.354c-.866 1.14-1.951 2.165-3.258 2.796L5.595 22c1.616-.78 2.897-2.033 3.873-3.347a3.27 3.27 0 0 0 4.262-2.642l5.98-1.324zM13.61 14.557l4.809-1.064 1.221-8.695-6.162 3.697H5.579l3.424 4.142a3.27 3.27 0 0 1 4.606 1.92m-3.116 2.815a1.823 1.823 0 0 0 1.274-3.129c-.288.87-.765 1.986-1.441 3.121q.082.008.167.008M8.67 15.548c0-.98.774-1.78 1.745-1.822a14.8 14.8 0 0 1-1.36 2.944c-.241-.309-.385-.699-.385-1.122'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgPolygonLasso;
