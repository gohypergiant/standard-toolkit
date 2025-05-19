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
const SvgWind = ({
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
      d='M14.348 18.45c-.28.89-1.01 1.62-1.9 1.9-1.51.48-2.94-.23-3.59-1.42-.35-.65.17-1.43.91-1.43h.01c.34 0 .68.16.84.46.17.32.5.54.89.54.55 0 1-.45 1-1s-.45-1-1-1h-7.51c-.55 0-1-.45-1-1s.45-1 1-1h7.5c1.96 0 3.5 1.9 2.85 3.95m2.56-12.28a3.49 3.49 0 0 0-2.58-2.58c-1.76-.4-3.37.53-4.02 1.98-.31.67.17 1.43.9 1.43.39 0 .75-.22.9-.57a1.5 1.5 0 0 1 1.39-.93c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-9.5c-.55 0-1 .45-1 1s.45 1 1 1h9.5c2.2 0 3.93-2.04 3.41-4.33m.49 5.33h-13.4c-.55 0-1 .45-1 1s.45 1 1 1h13.5c.83 0 1.5.67 1.5 1.5a1.5 1.5 0 0 1-.93 1.39c-.36.15-.57.51-.57.9 0 .73.76 1.21 1.43.91a3.51 3.51 0 0 0 2-3.93c-.34-1.64-1.86-2.77-3.53-2.77'
    />
  </svg>
);
export default SvgWind;
