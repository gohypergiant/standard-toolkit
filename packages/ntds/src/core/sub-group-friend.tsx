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
export const SvgSubGroupFriend = ({
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
        d='M4.72754 12C4.72754 16.0166 7.98338 19.2725 12 19.2725C16.0166 19.2725 19.2725 16.0166 19.2725 12H22C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12H4.72754Z'
        fill={fillColor}
      />
      <path
        d='M9.27246 11.9463C9.27266 13.4524 10.4939 14.6738 12 14.6738C13.5061 14.6738 14.7273 13.4524 14.7275 11.9463H17.4541C17.4539 14.9586 15.0123 17.4004 12 17.4004C8.98766 17.4004 6.5461 14.9586 6.5459 11.9463H9.27246Z'
        fill={fillColor}
      />
    </svg>
  );
};
