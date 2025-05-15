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
const SvgPopBackIn = ({
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
      d='M17.5 13V5.5h-12v12H13V19H5.5C4 19 4 17.5 4 17.5v-12C4 4 5.5 4 5.5 4h12C19 4 19 5.5 19 5.5V13zM17.5 19c-.361 0-2.163.01-2.5 0v-1.5h2.5c0-.355-.008-2.163 0-2.5H19v2.5c.332 0 2.169-.009 2.5 0V19c-.327.007-2.157 0-2.5 0-.022.324.004 2.167 0 2.5h-1.5z'
    />
  </svg>
);
export default SvgPopBackIn;
