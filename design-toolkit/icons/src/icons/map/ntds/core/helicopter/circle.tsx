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
const SvgCircle = ({
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
      fill='#FF69B4'
      d='m2.41 6.171 1.414 1.415 1.83-1.832 1.25 1.249a7.57 7.57 0 0 0-2.528 5.652h2.068a5.516 5.516 0 0 1 11.03 0h2.07a7.56 7.56 0 0 0-2.486-5.614l1.287-1.286 1.831 1.83 1.414-1.413-3.245-3.246-2.96 2.961a7.55 7.55 0 0 0-3.426-.816c-1.21 0-2.355.284-3.37.789L5.654 2.926z'
    />
    <path fill='#FF69B4' d='m11.952 11.282 2 2-2 2-2-2z' />
  </svg>
);
export default SvgCircle;
