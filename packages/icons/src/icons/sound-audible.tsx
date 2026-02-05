/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
const SvgSoundAudible = ({
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
      d='M13.663 18.667s-4.14-2.615-5-3.334c.034.028-1.674.001-2.083 0-1.246-.001-1.246-1.25-1.246-1.25V9.917s0-1.248 1.246-1.25h2.083c1.718-.041 3.564-2.239 5-3.334-.006 4.445 0 8.89 0 13.334M14.917 7c2.163.617 3.75 2.5 3.75 4.992V12c0 2.5-1.586 4.46-3.75 5l-.417-1.25c1.704-.424 2.917-1.902 2.917-3.738 0-1.79-1.277-3.295-2.917-3.762z'
    />
    <path
      fill='currentColor'
      d='M16.167 12c0 .92-.747 1.667-1.667 1.667v-3.334c.92 0 1.667.747 1.667 1.667'
    />
  </svg>
);
export default SvgSoundAudible;
