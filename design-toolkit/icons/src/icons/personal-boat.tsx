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
const SvgPersonalBoat = ({
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
      d='M11.762 1.132c.037 0 .067.008.097.008.406.095 1.605 1.068 1.935 1.39 1.223 1.185 2.085 2.737 2.647 4.245 0 0 .453 1.25.63 2.576.179 1.325 0 5.518 0 5.518l-.352 5.21-2.235.176c-.375.103-.173.6-.435.783-.3.212-1.26.212-1.687.212v.496h.835c.01.002.347.05.347.555 0 .573-.393.574-.41.574H10.72c-.293 0-.34-1.128.065-1.129h.85v-.48h-.85c-.405 0-.404-.023-.673-.17-.428-.24-.159-.716-.548-.834l-2.925-.16c.008-5.76-1.943-12.735 2.865-17.492.367-.366 1.658-1.485 2.265-1.485zm2.435 14.335 1.945.818v-2.627l-1.945-1.897zm-7.003-2.142v2.785l2.155-.717v-3.648zm3.28 1.977h2.598v-3.685h-2.598z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgPersonalBoat;
