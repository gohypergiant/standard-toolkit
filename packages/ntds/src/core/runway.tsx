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
export const SvgRunway = ({
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
        d='M22.0459 7.24219L21.2881 8H22V10H19.2881L17.2881 12H22V14H15.2881L7.23047 22.0576L5.81641 20.6436L20.6309 5.82812L22.0459 7.24219Z'
        fill={fillColor}
      />
      <path d='M20 20H16V16H20V20Z' fill={fillColor} />
      <path
        d='M19.2168 4.41406L4.40137 19.2295L2.9873 17.8154L6.80273 14H2V12H8.80273L10.8027 10H2V8H3V4H7V8H8V4H12V8H12.8027L17.8027 3L19.2168 4.41406Z'
        fill={fillColor}
      />
    </svg>
  );
};
