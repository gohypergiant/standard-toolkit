// __private-exports

/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { ThemeContextProvider } from '@tanstack/devtools-ui';
import { StreamDevtoolsPanel } from './panel';
import type { TanStackDevtoolsTheme } from '@tanstack/devtools-ui';
import type { StreamDevtoolsStore } from '../types';

interface DevtoolsProps {
  /** The in-process store the panel subscribes to (injected — no event bus). */
  store: StreamDevtoolsStore;
  /** Shell-provided theme; defaults to the shell's dark default. */
  theme?: TanStackDevtoolsTheme;
}

/** Default export for the core's lazy import — theme context seam; the injected store replaces an event-bus provider (see types.ts). */
export default function Devtools(props: DevtoolsProps) {
  return (
    <ThemeContextProvider theme={props.theme ?? 'dark'}>
      <StreamDevtoolsPanel store={props.store} />
    </ThemeContextProvider>
  );
}
