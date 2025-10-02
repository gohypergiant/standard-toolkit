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
const SvgSettings = ({
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
      d='m18.233 10.178 1.861.555a.34.34 0 0 1 .206.328v1.895a.34.34 0 0 1-.239.322l-1.872.555q-.196.664-.528 1.272l.922 1.723a.34.34 0 0 1-.06.4l-1.328 1.327a.34.34 0 0 1-.4.062l-1.728-.923a6.5 6.5 0 0 1-1.267.523l-.556 1.877a.34.34 0 0 1-.322.24h-1.878a.34.34 0 0 1-.322-.24l-.555-1.872a6.5 6.5 0 0 1-1.278-.522l-1.717.917a.34.34 0 0 1-.4-.062l-1.328-1.327a.34.34 0 0 1-.06-.4l.91-1.745a6.5 6.5 0 0 1-.555-1.294l-1.85-.556a.34.34 0 0 1-.239-.322v-1.878a.34.34 0 0 1 .239-.322l1.839-.556c.136-.458.322-.9.555-1.316l-.9-1.667a.34.34 0 0 1 .061-.4l1.35-1.317a.34.34 0 0 1 .4-.06l1.667.9a6.5 6.5 0 0 1 1.322-.556l.556-1.834a.34.34 0 0 1 .322-.238h1.878a.34.34 0 0 1 .328.227l.555 1.84c.456.136.896.322 1.311.555l1.695-.906a.34.34 0 0 1 .4.061l1.328 1.334a.34.34 0 0 1 .06.4l-.91 1.705q.334.618.527 1.295M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgSettings;
