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
const SvgMouseMiddleClick = ({
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
      d='M12 2C8.414 2 5 3.975 5 8v8a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6V8c0-4.025-3.414-6-7-6m5.5 14v-5.006q-.34.113-.818.233c-.577.145-1.305.287-2.182.387v-1.51c.734-.091 1.34-.212 1.818-.332A10 10 0 0 0 17.5 9.4V8c0-1.534-.626-2.598-1.567-3.319-.823-.63-1.94-1.031-3.183-1.147V5h-1.5V3.534c-1.243.116-2.36.518-3.183 1.147C7.127 5.402 6.5 6.466 6.5 8v1.4l.138.054c.225.084.573.2 1.044.318.478.12 1.084.24 1.818.331v1.51c-.877-.099-1.605-.241-2.182-.386q-.478-.122-.818-.233V16a4.5 4.5 0 0 0 4.5 4.5h2a4.5 4.5 0 0 0 4.5-4.5'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='M10.563 7.594a1.469 1.469 0 1 1 2.937 0v2.937a1.469 1.469 0 1 1-2.937 0z'
    />
  </svg>
);
export default SvgMouseMiddleClick;
