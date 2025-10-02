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
const SvgSelectionList = ({
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
      d='M2 17.969v-2h2v2zm4 0v-2h6v2zm-4-4v-2h2v2zm4 0v-2h6v2zm-4-4v-2h2v2zm4 0v-2h15.75v2zm-4-4v-2h2v2zm4 0v-2h15.75v2zM21.78 14.808l-7.383-2.758a.293.293 0 0 0-.38.377l2.766 7.413a.295.295 0 0 0 .283.191.29.29 0 0 0 .273-.206l.79-2.578 2.68 2.622a.294.294 0 0 0 .415 0l.69-.692a.295.295 0 0 0 0-.415l-2.67-2.61 2.535-.787a.294.294 0 0 0 0-.557'
    />
  </svg>
);
export default SvgSelectionList;
