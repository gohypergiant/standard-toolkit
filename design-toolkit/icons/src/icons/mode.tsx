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
const SvgMode = ({
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
      d='M16.02 3.28A8.8 8.8 0 0 1 18 8.077h-1.854a7.2 7.2 0 0 0-1.512-3.51zM9.9.022a8.83 8.83 0 0 1 4.797 1.99L13.41 3.297A7.2 7.2 0 0 0 9.9 1.822zm-1.8.01A9.04 9.04 0 0 0 3.303 2.02L4.59 3.298A7.2 7.2 0 0 1 8.1 1.831zM2.034 3.28l1.233 1.251v.036A7.2 7.2 0 0 0 1.8 8.077H0A9 9 0 0 1 2.034 3.28M0 10.778v4.5l1.44-1.44c1.602 2.493 4.383 4.14 7.56 4.14 4.338 0 7.983-3.106 8.82-7.2h-1.845A7.21 7.21 0 0 1 9 16.178c-2.655 0-5.049-1.45-6.3-3.6l1.8-1.8zm9 2.7 1.404-3.078L13.5 8.977l-3.096-1.404L9 4.477 7.587 7.573 4.5 8.977 7.587 10.4z'
    />
  </svg>
);
export default SvgMode;
