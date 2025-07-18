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

import { style } from '@vanilla-extract/css';
import {
  applyThemeVars,
  assignPartialVars,
  type ButtonState,
  buttonSpaceVars,
  buttonStateVars,
  type InputState,
  inputSpaceVars,
  inputStateVars,
  type QueryBuilderGroupState,
  type QueryBuilderRuleState,
  queryBuilderColorVars,
  queryBuilderGroupStateVars,
  queryBuilderRuleStateVars,
  queryBuilderSpaceVars,
  type SelectState,
  selectSpaceVars,
  selectStateVars,
  semanticColorVars,
  sizeVars,
  type ThemeContext,
} from '../../src';

export const QueryBuilder: ThemeContext['QueryBuilder'] = {
  group: {
    group: style(
      applyThemeVars<QueryBuilderGroupState>(queryBuilderGroupStateVars, [
        {
          vars: assignPartialVars(queryBuilderSpaceVars, {
            group: {
              gap: sizeVars.v05,
              x: sizeVars.v05,
              y: sizeVars.v05,
            },
            body: {
              gap: sizeVars.v04,
            },
          }),
        },
      ]),
    ),
  },
  rule: {
    core: style(
      applyThemeVars<QueryBuilderRuleState>(queryBuilderRuleStateVars, [
        {
          vars: assignPartialVars(queryBuilderSpaceVars, {
            core: {
              gap: sizeVars.v02,
            },
          }),
        },
      ]),
    ),
    values: style(
      applyThemeVars<QueryBuilderRuleState>(queryBuilderRuleStateVars, [
        {
          vars: assignPartialVars(queryBuilderSpaceVars, {
            values: {
              gap: sizeVars.v02,
            },
          }),
        },
      ]),
    ),
    error: style(
      applyThemeVars<QueryBuilderRuleState>(queryBuilderRuleStateVars, [
        {
          vars: assignPartialVars(queryBuilderColorVars, {
            error: {
              color: semanticColorVars.border.serious,
            },
          }),
        },
      ]),
    ),
  },
  input: {
    sizer: style(
      applyThemeVars<InputState>(inputStateVars, [
        {
          vars: assignPartialVars(inputSpaceVars, {
            width: '100%',
            maxWidth: 'none',
          }),
        },
      ]),
    ),
  },
  select: {
    select: style(
      applyThemeVars<SelectState>(selectStateVars, [
        { vars: assignPartialVars(selectSpaceVars, { width: '100%' }) },
      ]),
    ),
    toggle: {
      container: style(
        applyThemeVars<ButtonState>(buttonStateVars, [
          { vars: assignPartialVars(buttonSpaceVars, { width: '100%' }) },
        ]),
      ),
    },
  },
};
