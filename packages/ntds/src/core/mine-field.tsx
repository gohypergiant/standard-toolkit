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
export const SvgMineField = ({
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
        d='M13 4.63867C13.8675 4.79944 14.6621 5.1655 15.333 5.68457L17 4.01855L18.4141 5.43262L16.667 7.17871C17.0006 7.72957 17.2378 8.34413 17.3594 9H20V11H17.3496C17.2425 11.5472 17.0543 12.0647 16.7969 12.54L18.4141 14.1572L17 15.5713L15.5303 14.1016C14.8202 14.7056 13.9541 15.1298 13 15.3066V17H14V18L13 21V23H11V21L12.1318 18H11V15.3066C10.04 15.1287 9.16949 14.6998 8.45703 14.0898L6.99414 15.5537L5.58008 14.1396L7.19434 12.5244C6.94124 12.0534 6.75634 11.5411 6.65039 11H4V9H6.64062C6.76105 8.3501 6.99441 7.74035 7.32324 7.19336L5.58008 5.4502L6.99414 4.03613L8.65234 5.69434C9.32619 5.16956 10.1265 4.80055 11 4.63867V2H13V4.63867ZM12 7.27246C10.5029 7.27246 9.28812 8.47902 9.27344 9.97266C9.28779 11.4666 10.5027 12.6738 12 12.6738C13.4973 12.6738 14.7112 11.4666 14.7256 9.97266C14.7109 8.47902 13.4971 7.27246 12 7.27246Z'
        fill={fillColor}
      />
    </svg>
  );
};
