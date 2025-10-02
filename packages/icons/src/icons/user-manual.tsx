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
const SvgUserManual = ({
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
      d='M21 5.702V19c-2.414-1.363-6.552-1.9-9 0-2.487-1.93-6.443-1.442-9 0V5.657C5.303 4.304 9.595 3.472 12 5c2.466-1.325 6.759-.906 9 .702M12 6.5c2.124-1.32 5.274-1.228 7.5 0V17c-2.007-.755-5.613-.68-7.5.5z'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='M13.51 9.268c1.941-.822 3.218-.495 4.49-.178V7.538c-1.363-.27-2.606-.52-4.49.088zM13.51 12.127c1.863-.731 3.262-.343 4.49-.037v-1.552c-1.314-.26-2.682-.575-4.49-.034zM13.51 15.127c1.863-.731 3.262-.343 4.49-.037v-1.552c-1.314-.26-2.682-.575-4.49-.034z'
    />
  </svg>
);
export default SvgUserManual;
