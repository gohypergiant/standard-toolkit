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
const SvgAlertBase = ({
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
      d='M21.816 4.932c-.431-.822-1.412-1.117-2.19-.663L14.87 7 5.722 4.086A.95.95 0 0 0 5.332 4c-.542 0-.978.46-.978 1.029 0 .298.122.566.313.755l.008.005a1 1 0 0 0 .135.107l5.001 4.01-2.88 1.652-3.77-.832a.8.8 0 0 0-.331-.073c-.457 0-.83.39-.83.873 0 .22.077.42.204.572l.003.003q.076.093.176.158L4.303 14h4.941l12.003-6.97c.704-.414.962-1.351.569-2.098M12.75 15h-1.5v1.75H9.5v1.5h1.75V20h1.5v-1.75h1.75v-1.5h-1.75z'
    />
  </svg>
);
export default SvgAlertBase;
