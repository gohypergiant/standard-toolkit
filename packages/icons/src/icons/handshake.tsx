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
const SvgHandshake = ({
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
      d='M16.084 6H13.4a1 1 0 0 0-.675.262L9.644 9.086a1.24 1.24 0 0 0-.066 1.75c.397.434 1.231.55 1.753.084 0 0 1.677-1.53 2.51-2.293a.5.5 0 1 1 .675.737l-.816.747 4.797 3.89V7.998L16.79 6.294A1 1 0 0 0 16.084 6M19.5 8.006V15c0 .553.447 1 1 1h2V8.006zM21 15a.5.5 0 0 1-.5-.5c0-.275.225-.5.5-.5s.5.225.5.5-.225.5-.5.5m-18.5.996h2c.553 0 1-.446 1-1v-6.99h-3zM4 14c.275 0 .5.225.5.5s-.225.5-.5.5a.5.5 0 1 1 0-1m13.622.581-4.666-3.786-.937.86a2.254 2.254 0 0 1-3.178-.138 2.25 2.25 0 0 1 .137-3.177L11.534 6H8.916a1 1 0 0 0-.707.294L6.5 7.999v6.995h.572L9.9 17.552a2 2 0 0 0 2.813-.29l.006-.007.56.485a1.16 1.16 0 0 0 1.633-.17l.982-1.205.168.137a1 1 0 0 0 1.407-.146l.297-.366a1 1 0 0 0-.144-1.409'
    />
  </svg>
);
export default SvgHandshake;
