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

export const Record = ({ className, ref, ...props }: IconProps) => (
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
      d='M12.626 4C10.5042 4 8.46941 4.84285 6.96912 6.34315C5.46883 7.84344 4.62598 9.87827 4.62598 12C4.62598 14.1217 5.46883 16.1566 6.96912 17.6569C8.46941 19.1571 10.5042 20 12.626 20C14.7477 20 16.7825 19.1571 18.2828 17.6569C19.7831 16.1566 20.626 14.1217 20.626 12C20.626 9.87827 19.7831 7.84344 18.2828 6.34315C16.7825 4.84285 14.7477 4 12.626 4ZM6.75931 9.33333H8.89264C9.17554 9.33333 9.44685 9.44571 9.64689 9.64575C9.84693 9.84579 9.95931 10.1171 9.95931 10.4V11.4667C9.95931 12 9.55398 12.4267 9.04198 12.5013L10.29 14.6667H9.05264L7.82598 12.5333V14.6667H6.75931M12.0926 9.33333H14.226V10.4H12.0926V11.4667H14.226V12.5333H12.0926V13.6H14.226V14.6667H12.0926C11.8097 14.6667 11.5384 14.5543 11.3384 14.3542C11.1384 14.1542 11.026 13.8829 11.026 13.6V10.4C11.026 10.1171 11.1384 9.84579 11.3384 9.64575C11.5384 9.44571 11.8097 9.33333 12.0926 9.33333ZM16.3593 9.33333H18.4926V10.4H16.3593V13.6H18.4926V14.6667H16.3593C16.0764 14.6667 15.8051 14.5543 15.6051 14.3542C15.405 14.1542 15.2926 13.8829 15.2926 13.6V10.4C15.2926 10.1171 15.405 9.84579 15.6051 9.64575C15.8051 9.44571 16.0764 9.33333 16.3593 9.33333ZM7.82598 10.4V11.4667H8.89264V10.4'
      fill='currentColor'
    />
  </svg>
);
