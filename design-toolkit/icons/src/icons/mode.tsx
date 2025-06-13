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
      d='M19.02 6.28A8.8 8.8 0 0 1 21 11.079h-1.854a7.2 7.2 0 0 0-1.512-3.51zM12.9 3.024a8.83 8.83 0 0 1 4.797 1.989L16.41 6.299a7.2 7.2 0 0 0-3.51-1.476zm-1.8.009A9.04 9.04 0 0 0 6.303 5.02L7.59 6.299a7.2 7.2 0 0 1 3.51-1.467zM5.034 6.28l1.233 1.25v.037a7.2 7.2 0 0 0-1.467 3.51H3A9 9 0 0 1 5.034 6.28M3 13.778v4.5l1.44-1.44c1.602 2.492 4.383 4.14 7.56 4.14 4.338 0 7.983-3.106 8.82-7.2h-1.845a7.21 7.21 0 0 1-6.975 5.4c-2.655 0-5.049-1.45-6.3-3.6l1.8-1.8zm9 2.7 1.404-3.079 3.096-1.421-3.096-1.405L12 7.478l-1.413 3.095L7.5 11.978l3.087 1.422z'
    />
  </svg>
);
export default SvgMode;
