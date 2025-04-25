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

export const Lasso = ({ className, ref, ...props }: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    className={cn(
      '[color:var(--icon-color,currentColor)] [height:var(--icon-size,--spacing-xl)] [width:var(--icon-size,--spacing-xl)]',
      className,
    )}
    {...props}
    ref={ref}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M12.6375 13.4359L13.4295 14.2031C14.0691 14.8226 14.9364 15.2015 15.8955 15.2015C17.8532 15.2015 19.4403 13.6144 19.4403 11.6567C19.4403 9.69903 17.8532 8.112 15.8955 8.112C15.7249 8.112 15.558 8.12394 15.3953 8.14683L14.3007 8.30081L13.7927 7.31907C12.9778 5.74408 11.3365 4.67319 9.44776 4.67319C6.74818 4.67319 4.55974 6.86163 4.55974 9.56121C4.55974 10.7774 5.00388 11.8898 5.73881 12.7451C6.21675 11.3436 7.54465 10.3355 9.10798 10.3355C10.9181 10.3355 12.4126 11.6869 12.6375 13.4359ZM12.3652 15.3303C12.3639 15.3335 12.3625 15.3366 12.3612 15.3397C13.2784 16.2201 14.5238 16.7612 15.8955 16.7612C18.7146 16.7612 21 14.4759 21 11.6567C21 8.83761 18.7146 6.55226 15.8955 6.55226C15.652 6.55226 15.4124 6.56931 15.178 6.60229C14.1057 4.52988 11.9421 3.11345 9.44776 3.11345C5.88676 3.11345 3 6.00021 3 9.56121C3 11.7069 4.04807 13.6077 5.6602 14.7798C5.82608 15.4277 6.16976 16.0043 6.63615 16.4547C5.70005 17.6891 4.5269 18.7993 3.11339 19.4821L3.79182 20.8866C5.53805 20.043 6.92135 18.689 7.97502 17.269C8.3309 17.3885 8.71188 17.4532 9.10798 17.4532C10.5625 17.4532 11.8132 16.5806 12.3652 15.3303ZM9.10798 15.8934C10.212 15.8934 11.1071 14.9984 11.1071 13.8944C11.1071 13.3199 10.8648 12.8021 10.4769 12.4375C10.1694 13.3859 9.64721 14.6231 8.89697 15.8824C8.96632 15.8897 9.03671 15.8934 9.10798 15.8934ZM7.10891 13.8944C7.10891 12.8224 7.95256 11.9476 9.01209 11.8975C8.74059 12.7513 8.2519 13.9258 7.53254 15.1251C7.26711 14.7858 7.10891 14.3585 7.10891 13.8944Z'
      fill='currentColor'
    />
  </svg>
);
