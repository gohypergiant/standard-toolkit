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
const SvgColorPicker = ({
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
      d='M18.707 3.15q-1.06-1.059-2.121 0l-3.182 3.183-1.06-1.06-1.061 1.06 1.06 1.06-8.132 8.132-.883 3.359 1.06 1.06 3.359-.883 8.132-8.132 1.06 1.06L18 10.93l-1.06-1.06 3.181-3.183q1.06-1.06 0-2.12zm-5.303 5.304 1.414 1.414-7.845 7.845-1.92.505.506-1.919z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgColorPicker;
