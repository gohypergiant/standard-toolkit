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

import {
  type CSSProperties,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { getChildren, getParents } from '../data/tree-utils';
import { ChartContext } from '../lib/chart-context';
import {
  type ChartState,
  reducerChartState,
  updateChartState,
} from '../lib/chart-state';
import { gridTemplateRowName } from '../lib/css-grid-utils';
import { getTimelineTiming } from '../lib/timeline-timing';
import { Detail } from './detail';
import { Header } from './header';
import { Objective } from './objective';
import { Ruler } from './ruler';
import type { ChartData } from '../data';

interface LayoutProps {
  data: ChartData;
  state: ChartState;
}

const MIN_IN_AN_HOUR = 60;

export function Layout(props: LayoutProps) {
  const { gridTemplateRows, plugins } = useContext(ChartContext);
  const [state, dispatch] = useReducer(reducerChartState, props.state);
  const onUpdate = useCallback(updateChartState(props.data, dispatch), []);
  const times = useMemo(
    () => getTimelineTiming(state.focus, props.data),
    [state.focus, props.data],
  );
  const noData = useMemo(() => !times.timelineStart, [times.timelineStart]);

  return (
    <>
      <Header onUpdate={onUpdate} state={state} />

      <div
        className='grid [--row-height:2em]'
        style={{
          gridTemplateAreas: "'detail timing'",
          gridTemplateColumns: '12em 1fr',
        }}
      >
        <div className='grid' style={{ gridArea: 'detail', gridTemplateRows }}>
          {getParents(props.data).map(({ item, parents }) => (
            <Detail key={`${item.title}-label`} {...{ parents, item }} />
          ))}
        </div>

        {noData && <plugins.noData />}

        {!noData && (
          <div className='overflow-auto' style={{ gridArea: 'timing' }}>
            <div
              className='grid'
              style={
                {
                  '--timing-col-count': state.focus * MIN_IN_AN_HOUR,
                  gridTemplateRows,
                  width: `${state.zoom}%`,
                } as CSSProperties
              }
            >
              <Ruler
                hours={state.focus}
                startAt={new Date(times.timelineStart)}
              />

              {getChildren(props.data).map((treeNode, index) => {
                const rowName = gridTemplateRowName(
                  treeNode.parents.slice(0, -1),
                  `${treeNode.parents.at(-1)?.title}`,
                );

                return (
                  <Objective
                    key={`${rowName}-${index + 1}`}
                    row={rowName}
                    data={treeNode.item}
                    {...times}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
