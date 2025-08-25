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
export const SvgBaseFriend = ({
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
        d='M22 22H2V2H22V22ZM10.1816 20.1816H13.8184V16.5459H10.1816V20.1816ZM16.5459 20.1816H20.1816V16.5459H16.5459V20.1816ZM3.81836 20.1816H7.4541V16.5459H3.81836V20.1816ZM10.1816 13.8184H13.8184V10.1816H10.1816V13.8184ZM16.5459 13.8184H20.1816V10.1816H16.5459V13.8184ZM3.81836 13.8184H7.4541V10.1816H3.81836V13.8184ZM10.1816 7.4541H13.8184V3.81836H10.1816V7.4541ZM16.5459 7.4541H20.1816V3.81836H16.5459V7.4541ZM3.81836 7.4541H7.4541V3.81836H3.81836V7.4541Z'
        fill={fillColor}
      />
    </svg>
  );
};
