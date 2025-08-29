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
export const SvgCarrierFriend = ({
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
      <path d='M12 10L14 12L12 14L10 12L12 10Z' fill={fillColor} />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 19.2727C13.0051 19.2727 13.9626 19.0688 14.8334 18.7001V5.29985C13.9626 4.93117 13.0051 4.72727 12 4.72727C11.0291 4.72727 10.1026 4.91753 9.2558 5.2628V18.7372C10.1026 19.0825 11.0291 19.2727 12 19.2727ZM7.86141 17.9812V6.01885C5.96755 7.33176 4.72727 9.52104 4.72727 12C4.72727 14.479 5.96755 16.6682 7.86141 17.9812ZM19.2727 12C19.2727 14.4398 18.0713 16.5991 16.2278 17.9183V6.08165C18.0713 7.40093 19.2727 9.56016 19.2727 12Z'
        fill={fillColor}
      />
    </svg>
  );
};
