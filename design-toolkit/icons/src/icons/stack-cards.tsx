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
const SvgStackCards = ({
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
      d='M.542 5.954 8.65 9.947a.79.79 0 0 0 .699 0l8.11-3.993a.94.94 0 0 0 .394-.38c.097-.167.148-.365.148-.566 0-.202-.051-.4-.148-.568a.94.94 0 0 0-.394-.38L9.35.083a.79.79 0 0 0-.699 0L.542 4.061a.94.94 0 0 0-.394.38A1.15 1.15 0 0 0 0 5.007c0 .201.051.399.148.567.096.168.233.3.394.38'
    />
    <path
      fill='currentColor'
      d='m16.759 8.053-7.76 3.82-7.758-3.82C0 7.5-.435 9.023.5 9.5l8.15 3.918a.79.79 0 0 0 .7 0L17.5 9.5c1.016-.519.5-2-.741-1.447'
    />
    <path
      fill='currentColor'
      d='m16.795 11.273-7.759 3.82-7.759-3.82c-1.24-.553-1.676.97-.74 1.447l8.15 3.918a.79.79 0 0 0 .699 0l8.15-3.918c1.017-.519.5-2-.74-1.447'
    />
  </svg>
);
export default SvgStackCards;
