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
const SvgMrap = ({
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
      d='M1 14v-3l5.7-1.2L8.5 5h7.3l1.7 2v2h4.3v5H23v2h-1v1.8a2.8 2.8 0 0 1-5.6 0v-1.3L15 18H9l-2-1.5v1.3a2.8 2.8 0 0 1-5.6 0V16H1Zm8.5-7.8h2.2v3.3H8Zm3.3 0H15l1.2 1.2v2.1h-3.4Zm-11 9q2.4-3.4 4.8 0l-.9.3q-1.5-1.7-3 0Zm15.5 0q1.9-2.6 3.8 0l-.7.6q-1.2-1.5-2.4 0Z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgMrap;
