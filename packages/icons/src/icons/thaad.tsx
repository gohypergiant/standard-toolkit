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
const SvgThaad = ({
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
      d='M1 18.5V14l1.5-3H6v1l1 1v3.5h5.551L8.636 4.755l8.728-2.91 4.4 13.2L17.4 16.5H23v2h-.5a1.4 1.4 0 0 1-2.8 0h-1.2a1.4 1.4 0 0 1-2.8 0H9a1.4 1.4 0 0 1-2.8 0H5a1.4 1.4 0 0 1-2.8 0Zm2-6h2.2l.6 2H2.2Zm7.213-7.322 1.186-.395 3.83 11.492-1.185.395Zm2.479-.826 1.185-.395 3.831 11.492-1.186.395Zm2.478-.826 1.186-.396 3.83 11.493-1.185.395Z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgThaad;
