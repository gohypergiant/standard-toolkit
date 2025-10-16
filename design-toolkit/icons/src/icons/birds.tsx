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
const SvgBirds = ({
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
      d='M10.734 4.557c.91-.266 3.894-.768 7.246-1.22 2.466-.333 3.118-.396 3.008-.29-.034.034-.916.348-1.958.697-2.506.842-4.958 1.852-5.547 2.286-.895.66-1.013 2.127-.286 3.562.34.67.456.77 1.38 1.194.556.254 1.77.716 2.7 1.027.928.311 1.748.623 1.822.694.083.08-.537.127-1.654.127-.983 0-1.787.032-1.787.07s.307.482.681.986c.375.503.733 1 .796 1.106.128.214.148.223-1.048-.51-1.14-.701-2.938-1.478-3.736-1.614-.958-.165-1.729.017-2.286.538-.762.714-.96 2-.466 3.049.29.619 1.321 2.133 2.51 3.69.419.547.736 1.019.706 1.049-.088.084-2.88-2.05-4.506-3.444-2.312-1.982-3.767-3.838-3.767-4.806 0-.573.342-1.131.897-1.462.852-.509.787-.712-.545-1.716-.387-.291-.872-.7-1.077-.907s-.474-.377-.598-.377c-.435 0-.217-.238.604-.66.99-.511 1.782-.554 2.83-.156.825.314 1.447.349 1.667.093.085-.099.227-.511.317-.917.218-.986 1.005-1.77 2.097-2.089'
    />
  </svg>
);
export default SvgBirds;
