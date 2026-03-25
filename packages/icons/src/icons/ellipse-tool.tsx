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
const SvgEllipseTool = ({
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
      d='M15.889 16.06c1.977-1.977 3.206-4.229 3.647-6.213.445-2.006.06-3.515-.819-4.393-.878-.878-2.387-1.264-4.392-.818-1.985.44-4.237 1.67-6.214 3.646-1.977 1.978-3.206 4.23-3.647 6.215-.445 2.005-.06 3.514.818 4.392l-1.06 1.06C1.488 17.217 2.754 11.518 7.05 7.223c4.296-4.296 9.994-5.562 12.728-2.829s1.468 8.433-2.828 12.728c-4.296 4.296-9.995 5.562-12.728 2.829l1.06-1.061c.879.878 2.388 1.264 4.393.818 1.985-.44 4.237-1.67 6.214-3.646'
    />
    <path
      fill='currentColor'
      d='M21 4.75a2 2 0 1 1-4 0 2 2 0 0 1 4 0M6.5 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0'
    />
  </svg>
);
export default SvgEllipseTool;
