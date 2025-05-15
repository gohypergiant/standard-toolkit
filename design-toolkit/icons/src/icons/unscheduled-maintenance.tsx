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
const SvgUnscheduledMaintenance = ({
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
      d='m6.274 4.986-.013.007-.953-1.147-1.154.96 1.47 1.766V17.72s0 1.333 1.333 1.333h9.046l1.575 1.894 1.153-.96-.777-.934h.004l-1.107-1.333h-.006L9.083 8.386h.015l-.808-.973v.02L7.235 6.163h.017zm.683 12.734V8.175l7.937 9.545zM18.512 17.373V6.164H17.18v2.222h-6.131L8.095 4.831h2.462a2.223 2.223 0 0 1 4.355 0h3.6c1.334 0 1.334 1.333 1.334 1.333V17.72c0 .412-.128.696-.303.893zM12.734 6.164a.889.889 0 1 0 0-1.778.889.889 0 0 0 0 1.778'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgUnscheduledMaintenance;
