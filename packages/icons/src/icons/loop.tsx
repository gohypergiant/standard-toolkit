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
const SvgLoop = ({
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
      d='M11.996 1.906 8.997 4.37l2.999 2.464zM19 11.993c0-3.778-3.112-6.876-6.996-6.876v-1.5c4.692 0 8.496 3.75 8.496 8.376a8.3 8.3 0 0 1-2.488 5.923l-1.069-1.053A6.8 6.8 0 0 0 19 11.993M12.004 22.094l2.999-2.427-2.999-2.426zM5 12.16c0 3.686 3.09 6.75 6.996 6.75v1.5c-4.692 0-8.496-3.694-8.496-8.25 0-2.278.951-4.341 2.489-5.834l1.076 1.046C5.785 8.6 5 10.3 5 12.16'
    />
  </svg>
);
export default SvgLoop;
