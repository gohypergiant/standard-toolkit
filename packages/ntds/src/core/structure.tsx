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
interface Props {
  title?: string;
  titleId?: string;
}
export const SvgStructure = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & Props) => {
  const { fill } = props;
  const fillColor = fill ?? '#FF69B4';
  const hasTitle = typeof title === 'string' && Boolean(title.trim());

  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-labelledby={hasTitle ? titleId : undefined}
      {...props}
    >
      {hasTitle && <title id={titleId}>{title}</title>}
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8 22H2V16H8V22ZM4 20H6V18H4V20Z'
        fill={fillColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8 22H2V16H8V22ZM4 20H6V18H4V20Z'
        fill={fillColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8 22H2V16H8V22ZM4 20H6V18H4V20Z'
        fill={fillColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M22 22H10V16H15V13H22V22ZM17 18H12V20H20V15H17V18Z'
        fill={fillColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M22 22H10V16H15V13H22V22ZM17 18H12V20H20V15H17V18Z'
        fill={fillColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M22 22H10V16H15V13H22V22ZM17 18H12V20H20V15H17V18Z'
        fill={fillColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M13 12H2V2H13V12ZM4 10H11V4H4V10Z'
        fill={fillColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M13 12H2V2H13V12ZM4 10H11V4H4V10Z'
        fill={fillColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M13 12H2V2H13V12ZM4 10H11V4H4V10Z'
        fill={fillColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M22 10H15V2H22V10ZM17 8H20V4H17V8Z'
        fill={fillColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M22 10H15V2H22V10ZM17 8H20V4H17V8Z'
        fill={fillColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M22 10H15V2H22V10ZM17 8H20V4H17V8Z'
        fill={fillColor}
      />
    </svg>
  );
};
