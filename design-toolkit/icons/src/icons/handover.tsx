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
const SvgHandover = ({
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
      d='M17.995 13.742c.365.536.29 1.32-.182 1.748l-3.71 3.345a2.37 2.37 0 0 1-1.63.633h-.975l-3.528-.054a.2.2 0 0 1-.171-.096l-2.906-4.235c-.075-.108-.053-.268.033-.344l1.5-1.35c.462-.408 1.02-.633 1.598-.633h4.482c.6 0 1.083.557 1.083 1.244s-.483 1.233-1.083 1.233h-1.834c-.3 0-.536.278-.536.621 0 .344.236.622.536.622h2.188a.86.86 0 0 0 .536-.203l3.066-2.745c.472-.418 1.147-.322 1.512.214zm-1.823-9.06c-.042-.053-.107-.096-.171-.096l-3.528-.043h-.975c-.59-.021-1.169.204-1.63.622L6.158 8.51c-.471.43-.546 1.201-.182 1.748.365.536 1.051.632 1.512.214l3.066-2.744a.8.8 0 0 1 .536-.215h2.188c.3 0 .536.279.536.622s-.247.622-.536.622h-1.834c-.6 0-1.083.557-1.083 1.233 0 .686.483 1.243 1.083 1.243h4.482c.579 0 1.147-.225 1.597-.632l1.501-1.351a.26.26 0 0 0 .033-.343L16.15 4.672zm4.772 2.552-2.83-4.138c-.076-.107-.215-.129-.301-.043l-.676.611a.26.26 0 0 0-.032.343l2.842 4.139c.075.107.214.128.3.043l.675-.612a.26.26 0 0 0 .032-.343zm-16.887 8.62c-.075-.107-.214-.128-.3-.042l-.676.61a.26.26 0 0 0-.032.344l2.841 4.138c.076.108.215.129.3.043l.676-.61a.26.26 0 0 0 .032-.344z'
    />
  </svg>
);
export default SvgHandover;
