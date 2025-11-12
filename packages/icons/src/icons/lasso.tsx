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
const SvgLasso = ({
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
      d='m12.638 13.436.792.767a3.545 3.545 0 1 0 1.966-6.056L14.3 8.3l-.508-.982a4.888 4.888 0 1 0-8.054 5.426 3.56 3.56 0 0 1 6.898.69m-.273 1.894-.004.01a5.104 5.104 0 1 0 2.817-8.737A6.448 6.448 0 1 0 5.66 14.78c.166.647.51 1.223.976 1.674-.936 1.234-2.11 2.344-3.523 3.027l.679 1.405c1.746-.844 3.13-2.198 4.183-3.618a3.56 3.56 0 0 0 4.39-1.939m-3.257.563a2 2 0 0 0 1.369-3.456c-.308.949-.83 2.186-1.58 3.445q.105.011.211.011m-2-1.999a2 2 0 0 1 1.904-1.996 15.8 15.8 0 0 1-1.48 3.227 2 2 0 0 1-.423-1.23'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgLasso;
