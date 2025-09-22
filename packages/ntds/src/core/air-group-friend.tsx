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
export const SvgAirGroupFriend = ({
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
        d='M12 2C17.5228 2 22 6.47715 22 12H19.2725C19.2725 7.98338 16.0166 4.72754 12 4.72754C7.98338 4.72754 4.72754 7.98338 4.72754 12H2C2 6.47715 6.47715 2 12 2Z'
        fill={fillColor}
      />
      <path
        d='M12 6.5459C15.0125 6.5459 17.4541 8.98754 17.4541 12H14.7275C14.7275 10.4938 13.5062 9.27246 12 9.27246C10.4938 9.27246 9.27246 10.4938 9.27246 12H6.5459C6.5459 8.98754 8.98754 6.5459 12 6.5459Z'
        fill={fillColor}
      />
    </svg>
  );
};
