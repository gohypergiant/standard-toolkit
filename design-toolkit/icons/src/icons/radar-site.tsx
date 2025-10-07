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
const SvgRadarSite = ({
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
      d='M21 11.234a9.88 9.88 0 0 0-3.017-6.502A9.84 9.84 0 0 0 11.55 2v1.512a8.27 8.27 0 0 1 5.382 2.319 8.4 8.4 0 0 1 2.556 5.403zM9.835 10.921a1.49 1.49 0 0 1 2.065.04h.01c.581.575.581 1.493.04 2.087l4.9 4.96c-1.463 1.008-4.52 2.61-8.358 1.038V22H3l2.295-5.08C2.5 13.844 2.44 8.29 4.935 5.961zM14.055 8.865a4.2 4.2 0 0 1 1.232 2.369h-1.533a2.6 2.6 0 0 0-.742-1.27 2.6 2.6 0 0 0-1.463-.716V7.726c.932.08 1.824.484 2.506 1.139'
    />
    <path
      fill='currentColor'
      d='M16.009 6.798a7.1 7.1 0 0 1 2.134 4.426H16.64a5.54 5.54 0 0 0-1.663-3.337 5.5 5.5 0 0 0-3.428-1.522V4.853a6.97 6.97 0 0 1 4.46 1.945'
    />
  </svg>
);
export default SvgRadarSite;
