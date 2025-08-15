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
      fillRule='evenodd'
      d='M12 6.546a5.453 5.453 0 0 1 5.453 5.4v.027l.001.027a5.454 5.454 0 0 1-10.907 0l-.001-.054A5.454 5.454 0 0 1 12 6.546m0 2.726a2.727 2.727 0 0 0-2.727 2.7 2.727 2.727 0 0 0 5.453 0A2.726 2.726 0 0 0 12 9.273'
      clipRule='evenodd'
    />
    <path
      fill='#FF69B4'
      fillRule='evenodd'
      d='M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10M4.728 12a7.272 7.272 0 1 0 14.544 0 7.272 7.272 0 0 0-14.544 0'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgCircle;
