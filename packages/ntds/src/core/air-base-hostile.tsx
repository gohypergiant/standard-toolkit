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
export const SvgAirBaseHostile = ({
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
        d='M22 22H2V2H22V22ZM3.09286 19.6296L4.37926 20.9151L20.2617 5.03267L18.9762 3.74716L3.09286 19.6296ZM8.36364 19.5018V20.1818H9.27273V18.5927L8.36364 19.5018ZM10.1818 17.6836V20.1818H13.8182V16.5455H11.32L10.1818 17.6836ZM14.7273 13.1381V14.7273H13.1381L12.229 15.6364H14.7273V20.1818H15.6364V15.6364H20.1818V14.7273H15.6364V12.229L14.7273 13.1381ZM16.5455 20.1818H20.1818V16.5455H16.5455V20.1818ZM3.81818 14.7273V15.6364H4.51509L5.42418 14.7273H3.81818ZM3.81818 13.8182H6.33327L7.45455 12.6969V10.1818H3.81818V13.8182ZM16.5455 11.32V13.8182H20.1818V10.1818H17.6836L16.5455 11.32ZM8.36364 8.36364H3.81818V9.27273H8.36364V11.7878L9.27273 10.8787V9.27273H10.8787L11.7878 8.36364H9.27273V3.81818H8.36364V8.36364ZM18.5927 9.27273H20.1818V8.36364H19.5018L18.5927 9.27273ZM10.1818 7.45455H12.6969L13.8182 6.33327V3.81818H10.1818V7.45455ZM3.81818 7.45455H7.45455V3.81818H3.81818V7.45455ZM14.7273 5.42418L15.6364 4.51509V3.81818H14.7273V5.42418Z'
        fill={fillColor}
      />
    </svg>
  );
};
