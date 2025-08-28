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
export const SvgBaseHostile = ({
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
        d='M14.7273 14.7273H9.27273V9.27273H14.7273V14.7273ZM10.1818 13.8182H13.8182V10.1818H10.1818V13.8182Z'
        fill={fillColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M22 22H2V2H22V22ZM3.81818 20.1818H7.45455V16.5455H3.81818V20.1818ZM8.36364 8.36364H3.81818V9.27273H8.36364V14.7273H3.81818V15.6364H8.36364V20.1818H9.27273V15.6364H14.7273V20.1818H15.6364V15.6364H20.1818V14.7273H15.6364V9.27273H20.1818V8.36364H15.6364V3.81818H14.7273V8.36364H9.27273V3.81818H8.36364V8.36364ZM10.1818 20.1818H13.8182V16.5455H10.1818V20.1818ZM16.5455 20.1818H20.1818V16.5455H16.5455V20.1818ZM3.81818 13.8182H7.45455V10.1818H3.81818V13.8182ZM16.5455 13.8182H20.1818V10.1818H16.5455V13.8182ZM3.81818 7.45455H7.45455V3.81818H3.81818V7.45455ZM10.1818 7.45455H13.8182V3.81818H10.1818V7.45455ZM16.5455 7.45455H20.1818V3.81818H16.5455V7.45455Z'
        fill={fillColor}
      />
    </svg>
  );
};
