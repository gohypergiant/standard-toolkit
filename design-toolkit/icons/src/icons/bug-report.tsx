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
const SvgBugReport = ({
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
      d='M6.5 3H13l6 6v10.5q0 1.5-1.5 1.5h-11Q5 21 5 19.5v-15Q5 3 6.5 3m11 16.5v-10l-5-5h-6l-.188 14.812z'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='M15.25 10.35h-.905a3 3 0 0 0-.91-1.003l.465-.476a.52.52 0 0 0 0-.721.49.49 0 0 0-.705 0l-.735.752a2.896 2.896 0 0 0-1.415 0l-.74-.752a.49.49 0 0 0-.705 0 .52.52 0 0 0 0 .721l.46.476c-.37.26-.68.603-.905 1.002H8.25c-.275 0-.5.23-.5.512 0 .281.225.512.5.512h.545a3.5 3.5 0 0 0-.045.511v.512h-.5c-.275 0-.5.23-.5.511s.225.512.5.512h.5v.511c0 .174.02.343.045.512H8.25c-.275 0-.5.23-.5.512 0 .281.225.511.5.511h.905C9.675 16.381 10.64 17 11.75 17s2.075-.619 2.595-1.535h.905c.275 0 .5-.23.5-.511a.507.507 0 0 0-.5-.512h-.545c.025-.169.045-.338.045-.511v-.512h.5c.275 0 .5-.23.5-.512a.507.507 0 0 0-.5-.511h-.5v-.512c0-.174-.02-.343-.045-.511h.545c.275 0 .5-.23.5-.512a.507.507 0 0 0-.5-.512m-3 4.092h-1c-.275 0-.5-.23-.5-.511s.225-.512.5-.512h1c.275 0 .5.23.5.511a.507.507 0 0 1-.5.512m0-2.046h-1c-.275 0-.5-.23-.5-.512 0-.281.225-.511.5-.511h1c.275 0 .5.23.5.511a.507.507 0 0 1-.5.512'
    />
  </svg>
);
export default SvgBugReport;
