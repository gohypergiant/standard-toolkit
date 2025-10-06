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

import type React from 'react';
import type { ChartItem, ChartRow } from '../data';
import type { ChartState } from '../lib/chart-state';
import type { RulerDayProps } from './factories/ruler-day';
import type { RulerHourProps } from './factories/ruler-hour';

type BaseUpdate = {
  onUpdate: (state: Partial<ChartState>) => void;
  state: ChartState;
};
type NoProps = Record<string, never>; // empty object

export type DetailProps = { item: ChartRow | ChartItem };
export type FocusProps = BaseUpdate;
export type NoDataProps = NoProps;
export type TimingProps = { item: ChartItem };
export type TitleProps = NoProps;
export type ZoomProps = BaseUpdate;

export interface Plugins {
  detail: React.FC<DetailProps>;
  focus: React.FC<FocusProps> | false;
  noData: React.FC<NoDataProps>;
  rulerDay: React.FC<RulerDayProps> | false;
  rulerHour: React.FC<RulerHourProps> | false;
  timing: React.FC<TimingProps>;
  title: React.FC<TitleProps> | false;
  zoom: React.FC<ZoomProps> | false;
}

export interface PluginsInitial {
  detail?: React.FC<DetailProps> | false;
  focus?: React.FC<FocusProps> | false;
  noData?: React.FC<NoDataProps> | false | string;
  rulerDay?: React.FC<RulerDayProps> | false;
  rulerHour?: React.FC<RulerHourProps> | false;
  timing?: React.FC<TimingProps> | false;
  title?: React.FC<TitleProps> | false | string;
  zoom?: React.FC<ZoomProps> | false;
}
