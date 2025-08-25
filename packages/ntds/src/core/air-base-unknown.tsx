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
interface Props {
  title?: string;
  titleId?: string;
}
export const SvgAirBaseUnknown = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & Props) => {
  const { fill } = props;
  const fillColor = fill ?? '#FF69B4';
  const hasTitle = typeof title === 'string' && Boolean(title.trim());

  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-labelledby={hasTitle ? titleId : undefined}
      {...props}
    >
      {hasTitle && <title id={titleId}>{title}</title>}
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M15.6367 4.12109L17.6572 2.10059L21.8994 6.34277L19.8789 8.36328H22V15.6367H15.6367V22H8.36328V19.8789L6.34277 21.8994L2.10059 17.6572L4.12109 15.6367H2V8.36328H8.36328V2H15.6367V4.12109ZM10.1816 18.0605V20.1816H13.8184V16.5459H11.6963L10.1816 18.0605ZM4.92871 17.6572L6.34277 19.0713L19.0713 6.34277L17.6572 4.92871L4.92871 17.6572ZM3.81836 13.8184H5.93945L7.4541 12.3037V10.1816H3.81836V13.8184ZM16.5459 11.6963V13.8184H20.1816V10.1816H18.0605L16.5459 11.6963ZM10.1816 7.4541H12.3037L13.8184 5.93945V3.81836H10.1816V7.4541Z'
        fill={fillColor}
      />
    </svg>
  );
};
