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
export const SvgMissileFriend = ({
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
        d='M8.75705 12.3005H10.0645L11.9897 17.8032L13.9149 12.3005H15.2224L12.5148 19.7953H11.4647L8.75705 12.3005ZM8.05183 12.3005H9.35416L9.59095 17.6642V19.7953H8.05183V12.3005ZM14.6252 12.3005H15.9327V19.7953H14.3885V17.6642L14.6252 12.3005Z'
        fill={fillColor}
      />
      <path
        d='M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12H4.72727C4.72727 7.98338 7.98338 4.72727 12 4.72727C16.0166 4.72727 19.2727 7.98338 19.2727 12H22Z'
        fill={fillColor}
      />
    </svg>
  );
};
