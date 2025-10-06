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

import { getFilteredData } from '../data/get-filtered-data';
import type { ActionDispatch } from 'react';
import type { ChartData } from '../data';

export interface ChartState {
  data: ChartData;
  focus: number;
  zoom: number;
}

export interface ChartStateInitial {
  focus?: number;
  zoom?: number;
}

type UpdateAction =
  | { type: 'SET_FOCUS'; focus: number }
  | { type: 'SET_ZOOM'; zoom: number }
  | {
      type: 'UPDATE';
      payload: Partial<ChartState>;
      data: ChartData;
    };
type UpdateDispatch = ActionDispatch<[action: UpdateAction]>;

export const updateChartState =
  (data: ChartData, dispatch: UpdateDispatch) =>
  (updates: Partial<Omit<ChartState, 'data'>>) =>
    dispatch({ type: 'UPDATE', payload: updates, data: data });

export function initialChartState(
  data: ChartData,
  state: ChartStateInitial = {},
): ChartState {
  const focus = state.focus ?? 24;

  return {
    data: getFilteredData(data, focus),
    focus,
    zoom: state?.zoom ?? 100,
  };
}

export function reducerChartState(
  state: ChartState,
  action: UpdateAction,
): ChartState {
  switch (action.type) {
    case 'SET_FOCUS': {
      const data = getFilteredData(state.data, action.focus);

      return { ...state, focus: action.focus, data };
    }

    case 'SET_ZOOM':
      return { ...state, zoom: action.zoom };

    case 'UPDATE': {
      const focus = action.payload.focus ?? state.focus;
      const data = getFilteredData(action.data, focus);

      return {
        ...state,
        ...action.payload,
        focus,
        data,
      };
    }

    default:
      return state;
  }
}
