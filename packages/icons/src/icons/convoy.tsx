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
const SvgConvoy = ({
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
      d='M1 15v-4.2l2.4-.8V6.4l1.4-1h2.8L8.8 7v7.5H9V8.2h13.6V15h.4v1h-.2v1.5a2.4 2.4 0 0 1-4.8 0h-.3a2.4 2.4 0 0 1-4.8 0V16H6.8v1.5a2.4 2.4 0 0 1-4.8 0V16H1Zm3.6-8.5H6v3H4Zm2.4 0h.5l.3.7v2.3H7Z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgConvoy;
