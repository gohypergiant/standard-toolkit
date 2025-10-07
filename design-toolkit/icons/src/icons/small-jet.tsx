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
const SvgSmallJet = ({
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
      d='m11.72 2 .48.64.32 1.12v3.52h.64l.16 1.76 3.2 3.84h.16l1.92 2.24v1.6l-5.44-1.12-.16 1.92-.32.16-.32 1.12 2.56 2.4v.64l-2.88-.32V22h-.48v-.48l-2.88.32v-.64l2.56-2.4-.32-1.12-.32-.16-.16-1.92L5 16.72v-1.44l1.92-2.4h.16l3.2-3.84V7.28h.64l.16-2.08V3.76l.32-1.12z'
    />
  </svg>
);
export default SvgSmallJet;
