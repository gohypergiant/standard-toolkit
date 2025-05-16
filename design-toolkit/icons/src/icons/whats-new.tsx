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
const SvgWhatsNew = ({
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
      d='M14.225 5.652 12 3.5 9.775 5.652 6.71 5.22l-.535 3.049-2.735 1.45L4.8 12.5l-1.36 2.781 2.735 1.451.535 3.05 3.065-.434L12 21.5l2.225-2.152 3.065.433.535-3.049 2.735-1.45L19.2 12.5l1.36-2.781-2.735-1.451-.535-3.05zm-3.35 1.786h2.25l-.375 6.509h-1.5zM12 15.393c-1.14 0-1.125 1.085-1.125 1.085s.015 1.085 1.125 1.085 1.125-1.085 1.125-1.085-.014-1.085-1.125-1.085'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgWhatsNew;
