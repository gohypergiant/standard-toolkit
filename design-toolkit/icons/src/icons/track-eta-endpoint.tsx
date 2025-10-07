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
const SvgTrackEtaEndpoint = ({
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
      d='M8.938 4.607c-.944.39-1.828.969-2.595 1.736a8 8 0 0 0-1.736 2.595l1.386.573a6.5 6.5 0 0 1 1.41-2.107 6.5 6.5 0 0 1 2.108-1.411zM4.607 15.062l1.386-.573a6.5 6.5 0 0 0 1.41 2.107 6.5 6.5 0 0 0 2.108 1.41l-.573 1.387a8 8 0 0 1-2.595-1.736 8 8 0 0 1-1.736-2.595m10.455 4.33-.573-1.385a6.5 6.5 0 0 0 2.107-1.41 6.5 6.5 0 0 0 1.41-2.108l1.387.573a8 8 0 0 1-1.736 2.595 8 8 0 0 1-2.595 1.736m4.331-10.454-1.386.573a6.5 6.5 0 0 0-1.41-2.107 6.5 6.5 0 0 0-2.108-1.411l.573-1.386c.944.39 1.828.969 2.595 1.736a8 8 0 0 1 1.736 2.595'
      clipRule='evenodd'
    />
    <path fill='currentColor' d='M14 12.003a2 2 0 1 1-4 0 2 2 0 0 1 4 0' />
  </svg>
);
export default SvgTrackEtaEndpoint;
