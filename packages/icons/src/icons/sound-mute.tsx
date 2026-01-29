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
const SvgSoundMute = ({
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
      d='M12.83 18.667s-4.14-2.615-5-3.334c.03.028-1.674.001-2.083 0-1.246-.001-1.246-1.25-1.246-1.25-.002-1.471-.002-2.695 0-4.166 0 0 0-1.248 1.246-1.25H7.83c1.718-.041 3.564-2.239 5-3.334-.006 4.445 0 8.89 0 13.334M18.739 10.16l-1.85 1.851 1.85 1.85-.74.74-1.85-1.85-1.85 1.85-.74-.74 1.85-1.85-1.85-1.85.703-.703a237 237 0 0 0 1.887 1.813l1.85-1.85z'
    />
  </svg>
);
export default SvgSoundMute;
