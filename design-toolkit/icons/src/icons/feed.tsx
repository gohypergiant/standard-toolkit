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
const SvgFeed = ({
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
      d='M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0M12.587 19h2.372A9.472 9.472 0 0 0 5 9.04v2.373q.249-.017.501-.017A7.104 7.104 0 0 1 12.587 19'
    />
    <path
      fill='currentColor'
      d='M18.407 19h2.585q.008-.25.008-.5C21 9.94 14.06 3 5.5 3q-.25 0-.5.008v2.585q.25-.01.5-.01c7.134 0 12.917 5.783 12.917 12.917q0 .25-.01.5'
    />
  </svg>
);
export default SvgFeed;
