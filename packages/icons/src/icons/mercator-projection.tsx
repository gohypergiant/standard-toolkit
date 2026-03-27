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
const SvgMercatorProjection = ({
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
      d='M18 18H0V0h18zM1.5 16.5h9.778v-3.157c-1.494 0-1.5-1.488-1.5-1.5L2.69 4.755c-.506-.414-.9-.798-1.191-1.112zM14.278 2.843c0 .013-.006 1.5-1.5 1.5h-1v1.5c0 .012-.006 1.5-1.5 1.5h-1v2h4c1.486 0 1.5 1.472 1.5 1.5v1.5c.273.001 1.353 1.128 1.722 1.444V1.5h-2.222z'
    />
  </svg>
);
export default SvgMercatorProjection;
