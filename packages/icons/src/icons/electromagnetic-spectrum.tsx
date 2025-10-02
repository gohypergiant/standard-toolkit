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
const SvgElectromagneticSpectrum = ({
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
      d='M9.48 6.842c-.646-1.48-1.197-1.868-1.643-1.846-.858.043-1.61.746-2.188 2.148-.568 1.38-.849 3.191-.849 4.834H3c0-1.848.31-3.958 1.011-5.662.692-1.68 1.889-3.221 3.746-3.313 1.67-.082 2.689 1.473 3.343 2.97.676 1.545 1.205 3.583 1.708 5.523l.036.139c.53 2.037 1.036 3.962 1.667 5.384.662 1.493 1.261 1.982 1.795 1.986.756.005 1.488-.7 2.075-2.268.559-1.49.819-3.367.819-4.759H21c0 1.601-.29 3.747-.956 5.525-.638 1.701-1.806 3.51-3.75 3.497-1.674-.012-2.714-1.558-3.398-3.1-.716-1.614-1.266-3.728-1.782-5.713l-.004-.02c-.529-2.034-1.022-3.935-1.63-5.325'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgElectromagneticSpectrum;
