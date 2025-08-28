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
export const SvgTorpedoFriend = ({
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
        d='M12.7515 5.50519V13H11.2124V5.50519H12.7515ZM15.0576 5.50519V6.71486H8.94236V5.50519H15.0576Z'
        fill={fillColor}
      />
      <path
        d='M12 21C17.5228 21 22 16.5229 22 11H19.2727C19.2727 15.0166 16.0166 18.2727 12 18.2727C7.98338 18.2727 4.72727 15.0166 4.72727 11H2C2 16.5229 6.47715 21 12 21Z'
        fill={fillColor}
      />
    </svg>
  );
};
