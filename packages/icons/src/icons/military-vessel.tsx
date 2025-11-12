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
const SvgMilitaryVessel = ({
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
      d='m12.75 4.655 1.967 2.422h-2.76a3.05 3.05 0 0 0-1.363-.317c-1.605 0-2.906 1.217-2.906 2.718 0 1.502 1.3 2.719 2.906 2.719.607 0 1.17-.174 1.636-.472h2.817v3.487h-3.09a3.05 3.05 0 0 0-1.363-.318c-1.605 0-2.906 1.217-2.906 2.719s1.3 2.718 2.906 2.718c.607 0 1.17-.174 1.636-.471h1.805l-.488 1.612L12 22.875H9.047L7.64 21.472l-1.594-4.955V7.483l2.25-2.828.75-3.53H12z'
    />
    <path
      fill='currentColor'
      d='M10.594 15.946c.983 0 1.78.746 1.781 1.667 0 .92-.797 1.666-1.781 1.666s-1.781-.746-1.781-1.666.797-1.667 1.78-1.667M17.953 18.807h-4.748q.183-.349.255-.745h4.493zM17.953 17.01h-4.525a2.6 2.6 0 0 0-.311-.746h4.836zM10.594 7.812c.983 0 1.78.746 1.781 1.666s-.797 1.667-1.781 1.667-1.781-.746-1.781-1.667c0-.92.797-1.666 1.78-1.666M17.953 9.928v.745h-4.748q.183-.35.255-.745zM17.953 8.13v.745h-4.525a2.6 2.6 0 0 0-.311-.745z'
    />
  </svg>
);
export default SvgMilitaryVessel;
