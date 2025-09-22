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
export const SvgSurfaceGroupFriend = ({
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
        d='M12 6.5459C14.9945 6.5459 17.4243 8.95857 17.4531 11.9463C17.4531 11.9551 17.4532 11.9639 17.4531 11.9727C17.4532 11.9818 17.4541 11.9909 17.4541 12C17.4251 14.9875 14.9944 17.4004 12 17.4004C9.00559 17.4004 6.57589 14.9875 6.54688 12L6.5459 11.9463C6.57472 8.95857 9.00546 6.5459 12 6.5459ZM12 9.27246C10.5029 9.27246 9.28812 10.479 9.27344 11.9727C9.28779 13.4666 10.5027 14.6738 12 14.6738C13.4973 14.6738 14.7112 13.4666 14.7256 11.9727C14.7109 10.479 13.4971 9.27246 12 9.27246Z'
        fill={fillColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM4.72754 12C4.72754 16.0166 7.98338 19.2725 12 19.2725C16.0166 19.2725 19.2725 16.0166 19.2725 12C19.2725 7.98338 16.0166 4.72754 12 4.72754C7.98338 4.72754 4.72754 7.98338 4.72754 12Z'
        fill={fillColor}
      />
    </svg>
  );
};
