import { style } from '@vanilla-extract/css';
import {
  applyThemeVars,
  assignPartialVars,
  buttonSpaceVars,
  buttonStateVars,
  inputSpaceVars,
  inputStateVars,
  queryBuilderGroupStateVars,
  queryBuilderSpaceVars,
  selectSpaceVars,
  selectStateVars,
  sizeVars,
  type ButtonState,
  type InputState,
  type QueryBuilderGroupState,
  type SelectState,
  type ThemeContext,
  type QueryBuilderRuleState,
  queryBuilderColorVars,
  semanticColorVars,
  queryBuilderRuleStateVars,
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
