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
      d='m3.542 8.954 8.107 3.993a.8.8 0 0 0 .699 0l8.11-3.993a.94.94 0 0 0 .394-.38c.097-.167.148-.365.148-.566 0-.202-.051-.4-.148-.568a.94.94 0 0 0-.394-.38L12.35 3.083a.79.79 0 0 0-.699 0l-8.11 3.979a.94.94 0 0 0-.394.38A1.15 1.15 0 0 0 3 8.007c0 .201.051.399.148.567.096.168.233.3.394.38'
    />
    <path
      fill='currentColor'
      d='m19.759 11.053-7.76 3.82-7.758-3.82C3 10.5 2.565 12.023 3.5 12.5l8.15 3.918a.79.79 0 0 0 .7 0L20.5 12.5c1.016-.519.5-2-.741-1.447'
    />
    <path
      fill='currentColor'
      d='m19.795 14.273-7.759 3.82-7.759-3.82c-1.24-.553-1.676.97-.74 1.447l8.15 3.918a.79.79 0 0 0 .699 0l8.15-3.918c1.017-.519.5-2-.74-1.447'
    />
  </svg>
);
export default SvgStackCards;
