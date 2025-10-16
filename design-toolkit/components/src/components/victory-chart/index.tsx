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

'use client';

import { Layout } from './components/layout';
import { ChartContext } from './lib/chart-context';
import { type ChartStateInitial, initialChartState } from './lib/chart-state';
import { genGridTemplateRows, rulerGridRows } from './lib/css-grid-utils';
import { mergePlugins } from './plugins/merge-plugins';
import type { ChartData } from './data';
import type { PluginsInitial } from './plugins';

export interface VictoryChartProps {
  data: ChartData;
  plugins?: PluginsInitial;
  state?: ChartStateInitial;
}

/**
 * Create a new instance of the VICTORY Chart.
 *
 * @example
 * ```ts
 * // minimal implementation
 * import { VictoryChart } from '@/components/victory-chart';
 *
 * // ...
 * <VictoryChart data={data} />
 * // ...
 * ```
 *
 * @param props [VictoryChartProps]
 * @param props.data [ChartData] - the data to use for generation
 * @param props.plugins - components for customization
 * @param props.state - the initial state settings
 */
export function VictoryChart(props: VictoryChartProps) {
  const plugins = mergePlugins(props.plugins);

  return (
    <ChartContext.Provider
      value={{
        gridTemplateRows: genGridTemplateRows(plugins, props.data),
        plugins,
        rulerRows: rulerGridRows(!!plugins.rulerDay, !!plugins.rulerHour),
      }}
    >
      <Layout
        data={props.data}
        state={initialChartState(props.data, props.state)}
      />
    </ChartContext.Provider>
  );
}
