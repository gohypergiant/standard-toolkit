// __private-exports
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

import { type PropsWithChildren, useContext } from 'react';
import { ChartContext } from '../lib/chart-context';
import type { ChartState } from '../lib/chart-state';

interface HeaderProps extends PropsWithChildren {
  onUpdate: (state: Partial<ChartState>) => void;
  state: ChartState;
}

export function Header(props: HeaderProps) {
  const { plugins } = useContext(ChartContext);

  // if all of them are false, no need to render anything
  if (!(plugins.title || plugins.focus || plugins.zoom)) {
    return null;
  }

  return (
    <div style={{ alignItems: 'flex-start', display: 'flex' }}>
      <div style={{ flex: 1 }}>{plugins.title && <plugins.title />}</div>

      <div style={{ flex: 0 }}>
        {plugins.focus && (
          <plugins.focus onUpdate={props.onUpdate} state={props.state} />
        )}
        {plugins.zoom && (
          <plugins.zoom onUpdate={props.onUpdate} state={props.state} />
        )}
      </div>
    </div>
  );
}
