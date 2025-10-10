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

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgBattleStation = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M5 6.455 12 3l7 3.455v4.181c0 4.794-2.7 9.276-7 10.364-4.3-1.088-7-5.57-7-10.364zm2 7.584 4.23-1.27v2.539l-1.153 1.269V17L12 16.577l1.923.423v-.423l-1.154-1.27V12.77L17 14.04v-.847l-4.23-2.961V7.692C12.77 7.111 12.384 6 12 6s-.77 1.11-.77 1.692v2.539L7 13.192z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgBattleStation;
