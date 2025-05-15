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
const SvgInterceptPoint = ({
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
      d='M8.89 19.89C4.21 19.4.49 15.68 0 11l2.017 2.017a8.53 8.53 0 0 0 4.856 4.856zM19.89 11c-.49 4.68-4.21 8.4-8.89 8.89l2.017-2.017a8.53 8.53 0 0 0 4.856-4.856zM11 0c4.68.49 8.4 4.21 8.89 8.89l-2.017-2.017a8.53 8.53 0 0 0-4.856-4.856zM0 8.89C.49 4.21 4.21.49 8.89 0L6.873 2.017a8.53 8.53 0 0 0-4.856 4.856zM9.945 11.445a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3'
    />
  </svg>
);
export default SvgInterceptPoint;
