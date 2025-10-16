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

/// <reference types="react" />

export {}; // Make this a module

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  // biome-ignore lint/style/useNamingConvention: convention
  namespace JSX {
    interface Element
      extends React.ReactElement<
        unknown,
        string | React.JSXElementConstructor<unknown>
      > {}
    interface ElementClass extends React.Component<unknown, unknown> {}
    interface IntrinsicElements {
      div: React.HTMLAttributes<HTMLDivElement>;
      span: React.HTMLAttributes<HTMLSpanElement>;
      // Add other HTML elements as needed
    }
  }
}
