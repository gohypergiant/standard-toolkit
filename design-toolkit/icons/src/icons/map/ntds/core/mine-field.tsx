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
const SvgMineField = ({
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
      fillRule='evenodd'
      d='M13 4.639c.867.16 1.662.526 2.333 1.046L17 4.019l1.414 1.414-1.747 1.746c.334.55.57 1.165.692 1.821H20v2h-2.65a5.4 5.4 0 0 1-.553 1.54l1.617 1.617L17 15.571l-1.47-1.47A5.4 5.4 0 0 1 13 15.308V17h1v1l-1 3v2h-2v-2l1.132-3H11v-2.693a5.4 5.4 0 0 1-2.543-1.217l-1.463 1.464L5.58 14.14l1.614-1.616A5.4 5.4 0 0 1 6.65 11H4V9h2.64c.121-.65.354-1.26.683-1.807L5.58 5.45l1.414-1.414 1.658 1.658A5.4 5.4 0 0 1 11 4.64V2h2zm-1 2.633a2.727 2.727 0 0 0-2.727 2.7 2.727 2.727 0 0 0 5.453 0A2.726 2.726 0 0 0 12 7.273'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgMineField;
