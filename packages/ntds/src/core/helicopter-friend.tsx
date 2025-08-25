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
export const SvgHelicopterFriend = ({
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
        d='M2.40967 6.17148L3.82373 7.58554L5.65479 5.75449L6.9031 7.0028C5.3518 8.39144 4.37554 10.4093 4.37554 12.6552H6.44386C6.44386 9.60908 8.91325 7.13969 11.9594 7.13969C15.0055 7.13969 17.4749 9.60908 17.4749 12.6552H19.5432C19.5432 10.43 18.5849 8.42866 17.0584 7.04135L18.3452 5.75454L20.1763 7.58559L21.5904 6.17153L18.3452 2.92641L15.3846 5.88708C14.3557 5.36537 13.1919 5.07136 11.9594 5.07136C10.7485 5.07136 9.60381 5.35518 8.58833 5.85991L5.65479 2.92636L2.40967 6.17148Z'
        fill={fillColor}
      />
      <path
        d='M11.9518 11.2816L13.9518 13.2816L11.9518 15.2816L9.95181 13.2816L11.9518 11.2816Z'
        fill={fillColor}
      />
    </svg>
  );
};
