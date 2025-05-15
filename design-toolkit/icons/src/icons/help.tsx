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
const SvgHelp = ({
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
      d='M3 12c0-4.968 4.032-9 9-9s9 4.032 9 9-4.032 9-9 9-9-4.032-9-9m7.973 1.398q-.024.387-.024.943h1.99q0-.322.016-.548.017-.234.08-.427.055-.193.191-.379a4 4 0 0 1 .374-.427q.39-.345.773-.71.39-.37.692-.78.303-.405.494-.871.19-.475.191-1.048 0-.774-.255-1.362a2.66 2.66 0 0 0-.732-.991 3.3 3.3 0 0 0-1.187-.597A5.7 5.7 0 0 0 11.992 6q-.788 0-1.465.201a3.3 3.3 0 0 0-1.178.597q-.502.402-.796 1.015-.296.605-.303 1.427h2.221q.008-.371.136-.637a1.29 1.29 0 0 1 .828-.677q.27-.08.557-.08.367 0 .645.08.287.08.486.242.19.178.294.451.104.267.104.637 0 .306-.136.612-.135.306-.35.597a6 6 0 0 1-.494.58q-.27.274-.541.524-.375.299-.581.564-.207.258-.31.564a3 3 0 0 0-.136.701m-.008 2.499a1.23 1.23 0 0 0-.342.886q0 .516.342.87.342.348.947.347.59 0 .94-.346.358-.355.358-.87 0-.533-.358-.887-.35-.363-.94-.363-.605 0-.947.363'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgHelp;
