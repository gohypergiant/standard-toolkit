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

import { cn } from '../lib/utils';
import type { IconProps } from './types';

export const GlobalShare = ({ className, ref, ...props }: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    className={cn(
      '[height:var(--icon-size,--spacing-xl)] [width:var(--icon-size,--spacing-xl)] [color:var(--icon-color,currentColor)]',
      className,
    )}
    {...props}
    ref={ref}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M5.22456 10.2C5.08471 10.7771 5.01059 11.3799 5.01059 12C5.01059 12.6201 5.08471 13.2229 5.22456 13.8H8.76779C8.6761 13.2119 8.62326 12.6155 8.61074 12.0144C8.61054 12.0048 8.61054 11.9952 8.61074 11.9856C8.62326 11.3845 8.6761 10.7881 8.76779 10.2H5.22456ZM5.70641 8.81538H9.05927C9.46555 7.29003 10.1392 5.84423 11.0526 4.54734C8.67175 5.04747 6.7002 6.65964 5.70641 8.81538ZM12.626 4.75696C11.6583 5.96655 10.9384 7.34581 10.4981 8.81538H14.7539C14.3136 7.34581 13.5937 5.96655 12.626 4.75696ZM15.0808 10.2H10.1711C10.0679 10.7916 10.0087 11.3931 9.99537 12C10.0087 12.6069 10.0679 13.2084 10.1711 13.8H15.0808C15.184 13.2084 15.2432 12.6069 15.2566 12C15.2432 11.3931 15.184 10.7916 15.0808 10.2ZM16.4842 13.8C16.5758 13.2119 16.6287 12.6155 16.6412 12.0144C16.6414 12.0048 16.6414 11.9952 16.6412 11.9856C16.6287 11.3845 16.5758 10.7881 16.4842 10.2H20.0274C20.1672 10.7771 20.2414 11.3799 20.2414 12C20.2414 12.6201 20.1672 13.2229 20.0274 13.8H16.4842ZM14.7539 15.1846H10.4981C10.9384 16.6542 11.6583 18.0334 12.626 19.243C13.5937 18.0334 14.3136 16.6542 14.7539 15.1846ZM11.0526 19.4527C10.1392 18.1558 9.46555 16.71 9.05927 15.1846H5.70641C6.7002 17.3404 8.67175 18.9525 11.0526 19.4527ZM14.1994 19.4527C15.1127 18.1558 15.7864 16.71 16.1927 15.1846H19.5455C18.5517 17.3404 16.5802 18.9525 14.1994 19.4527ZM19.5455 8.81538H16.1927C15.7864 7.29003 15.1127 5.84423 14.1994 4.54734C16.5802 5.04747 18.5518 6.65964 19.5455 8.81538ZM3.62598 12C3.62598 7.02944 7.65541 3 12.626 3C17.5965 3 21.626 7.02944 21.626 12C21.626 16.9706 17.5965 21 12.626 21C7.65541 21 3.62598 16.9706 3.62598 12Z'
      fill='currentColor'
    />
  </svg>
);
