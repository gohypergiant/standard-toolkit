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
export const SvgHelicopterUnknown = ({
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
        d='M2.76562 6.19791L4.17969 7.61197L6.02441 5.76627L8.52743 8.31849L4.32521 12.5207H6.8835L12.0001 7.40414L17.1166 12.5207H19.6749L15.4728 8.31859L17.9757 5.76724L19.8205 7.61197L21.2345 6.19791L17.963 2.92545L14.0583 6.90407L12.0001 4.84585L9.94185 6.90407L6.03711 2.92545L2.76562 6.19791Z'
        fill={fillColor}
      />
      <path
        d='M12.0012 11L14.0023 13.0011L12.0012 15.0022L10.0001 13.0011L12.0012 11Z'
        fill={fillColor}
      />
    </svg>
  );
};
