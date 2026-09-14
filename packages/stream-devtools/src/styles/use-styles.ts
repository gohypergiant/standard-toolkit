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

import { STREAM_STATUS } from '@accelint/stream';
import { createTheme } from '@tanstack/devtools-ui';
import * as goober from 'goober';
import { createEffect, createSignal } from 'solid-js';
import { tokens } from './tokens';
import type { StreamStatus } from '@accelint/stream';
import type { TanStackDevtoolsTheme } from '@tanstack/devtools-ui';

/**
 * The form-devtools styling architecture: one `stylesFactory(theme)` with a
 * `t(light, dark)` picker over vendored tokens, exposed through a hook that
 * re-derives classes when the devtools-ui theme context flips. Dark values
 * are the query-devtools palette the panel has always used; light values
 * are the same scale mirrored.
 */
const stylesFactory = (theme: TanStackDevtoolsTheme) => {
  const { colors, font } = tokens;
  const css = goober.css;
  const t = (light: string, dark: string) => (theme === 'light' ? light : dark);

  const text = t(colors.gray[700], colors.gray[300]);
  const muted = colors.gray[500];
  const border = t(colors.gray[300], colors.darkGray[400]);
  const surface = t(colors.gray[100], colors.darkGray[600]);
  const warning = t(colors.yellow[600], colors.yellow[400]);

  /** query-devtools hue semantics — solid badge fills (600 works on both). */
  const statusBase: Record<StreamStatus, string> = {
    [STREAM_STATUS.CONNECTED]: colors.green[600],
    [STREAM_STATUS.CONNECTING]: colors.blue[600],
    [STREAM_STATUS.ERROR]: colors.red[600],
    [STREAM_STATUS.DISCONNECTED]: t(colors.gray[400], colors.gray[600]),
  };

  /** Chip indicator dots — the 500 step reads on both themes. */
  const statusDot: Record<StreamStatus, string> = {
    [STREAM_STATUS.CONNECTED]: colors.green[500],
    [STREAM_STATUS.CONNECTING]: colors.blue[500],
    [STREAM_STATUS.ERROR]: colors.red[500],
    [STREAM_STATUS.DISCONNECTED]: colors.gray[400],
  };

  /**
   * Live count-box pairing (query-devtools `queryStatusTag`): dark pairs
   * 900 background with 300 text, light pairs 100 with 700. Disconnected
   * has no pairing — its count box stays neutral at any count.
   */
  const statusCount: Partial<
    Record<StreamStatus, { background: string; color: string }>
  > = {
    [STREAM_STATUS.CONNECTED]: {
      background: t(colors.green[100], colors.green[900]),
      color: t(colors.green[700], colors.green[300]),
    },
    [STREAM_STATUS.CONNECTING]: {
      background: t(colors.blue[100], colors.blue[900]),
      color: t(colors.blue[700], colors.blue[300]),
    },
    [STREAM_STATUS.ERROR]: {
      background: t(colors.red[100], colors.red[900]),
      color: t(colors.red[700], colors.red[300]),
    },
  };

  return {
    // ---- panel.tsx ----
    panel: css`
      box-sizing: border-box;
      color: ${text};
      display: flex;
      flex-direction: column;
      font-family: ${font.sans};
      font-size: 12px;
      gap: 8px;
      height: 100%;
      overflow: hidden;
    `,
    headerGroup: css`
      align-items: center;
      display: flex;
      gap: 8px;
    `,
    rate: css`
      color: ${muted};
      font-family: ${font.mono};
      font-size: 11px;
      margin-left: auto;
    `,
    statusChip: (interactive: boolean) => css`
      align-items: center;
      background: ${t(colors.gray[100], colors.darkGray[500])};
      border: 1px solid transparent;
      border-radius: 4px;
      box-sizing: border-box;
      display: flex;
      font-weight: 500;
      gap: 6px;
      height: 26px;
      padding: 4px 4px 4px 6px;
      user-select: none;
      ${
        interactive
          ? `cursor: pointer;
      &:hover {
        background: ${t(colors.gray[200], `${colors.darkGray[400]}cc`)};
      }`
          : ''
      }
    `,
    chipLabel: css`
      font-size: 11px;
      text-transform: capitalize;
    `,
    chipDot: (status: StreamStatus) => css`
      background-color: ${statusDot[status]};
      border-radius: 9999px;
      height: 6px;
      width: 6px;
    `,
    chipCount: (status: StreamStatus, live: boolean) => {
      const pairing = live ? statusCount[status] : undefined;
      return css`
        align-items: center;
        background: ${pairing?.background ?? t(colors.gray[200], colors.darkGray[300])};
        border-radius: 2px;
        color: ${pairing?.color ?? t(colors.gray[600], colors.gray[400])};
        display: flex;
        font-size: 11px;
        font-variant-numeric: tabular-nums;
        height: 18px;
        justify-content: center;
        padding: 0 5px;
      `;
    },
    body: (stacked: boolean) => css`
      display: flex;
      flex: 1;
      flex-direction: ${stacked ? 'column' : 'row'};
      gap: 8px;
      min-height: 0;
      min-width: 0;
      padding: 0 8px 8px 8px;
    `,
    list: css`
      contain: inline-size;
      display: flex;
      flex: 1 1 0%;
      flex-direction: column;
      list-style: none;
      margin: 0;
      min-width: 0;
      overflow: auto;
      padding: 0;
    `,
    emptyText: css`
      color: ${muted};
      margin: 0;
      padding: 8px 12px;
    `,
    row: css`
      border-bottom: 1px solid ${surface};
    `,
    rowButton: (selected: boolean) => css`
      align-items: center;
      background: ${selected ? surface : 'none'};
      border: none;
      border-radius: 4px;
      color: inherit;
      cursor: pointer;
      display: flex;
      font: inherit;
      gap: 8px;
      padding: 3px 6px;
      text-align: left;
      width: 100%;
    `,
    observerCount: (status: StreamStatus) => css`
      background-color: ${statusBase[status]};
      border-radius: 4px;
      color: #ffffff;
      flex: 0 0 auto;
      font-size: 11px;
      font-weight: 600;
      line-height: 18px;
      min-width: 22px;
      padding: 0 4px;
      text-align: center;
    `,
    rowHash: css`
      font-family: ${font.mono};
      font-size: 11.5px;
      min-width: 0;
      overflow-wrap: anywhere;
    `,
    rowMeta: css`
      color: ${muted};
      flex-shrink: 0;
      font-family: ${font.mono};
      font-size: 11px;
      font-variant-numeric: tabular-nums;
      margin-left: auto;
    `,
    visuallyHidden: css`
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    `,

    // ---- detail-pane.tsx ----
    pane: (stacked: boolean) => css`
      ${
        stacked
          ? `border-top: 1px solid ${border}; padding-top: 8px;`
          : `border-left: 1px solid ${border}; padding-left: 8px;`
      }
      contain: inline-size;
      display: flex;
      flex: 1 1 0%;
      flex-direction: column;
      min-width: 0;
      overflow: auto;
    `,
    summary: css`
      cursor: pointer;
      list-style: none;
    `,
    countHint: css`
      color: ${muted};
      font-weight: 400;
    `,
    chevron: (open: boolean) => css`
      display: inline-block;
      font-size: 9px;
      transform: ${open ? 'rotate(90deg)' : 'none'};
      transition: transform 0.1s;
    `,
    hashRow: css`
      align-items: flex-start;
      display: flex;
      gap: 8px;
      justify-content: space-between;
      margin-bottom: 6px;
    `,
    hashCode: css`
      font-family: ${font.mono};
      font-size: 12px;
      margin: 0;
      min-width: 0;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    `,
    detailRow: css`
      display: flex;
      gap: 8px;
      justify-content: space-between;
      margin-bottom: 4px;
    `,
    detailLabel: css`
      color: ${muted};
      flex-shrink: 0;
    `,
    detailValue: css`
      font-family: ${font.mono};
      font-size: 11.5px;
      font-variant-numeric: tabular-nums;
      min-width: 0;
      overflow-wrap: anywhere;
      text-align: right;
    `,
    eventList: css`
      display: flex;
      flex-direction: column;
      font-family: ${font.mono};
      font-size: 11.5px;
      gap: 2px;
      list-style: none;
      margin: 0;
      padding: 0;
    `,
    logRow: css`
      align-items: baseline;
      display: flex;
      gap: 8px;
    `,
    timestamp: css`
      color: ${muted};
    `,
    duplicateBadge: css`
      border-radius: 4px;
      color: ${warning};
      outline: 1px solid ${warning};
      padding: 0 4px;
    `,
    mutedText: css`
      color: ${muted};
      margin: 0;
    `,
    copyButton: css`
      background: none;
      border: 1px solid ${t(colors.gray[300], colors.darkGray[300])};
      border-radius: 4px;
      color: ${muted};
      cursor: pointer;
      font: inherit;
      padding: 0 4px;
    `,
    payloadBody: css`
      padding: 4px 0 4px 16px;
    `,

    // ---- action-row.tsx ----
    actionRow: css`
      align-items: flex-start;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
    `,
    injectInput: css`
      background: ${t('#ffffff', colors.darkGray[800])};
      border: 1px solid ${t(colors.gray[300], colors.darkGray[300])};
      border-radius: 4px;
      box-sizing: border-box;
      color: ${text};
      flex: 1;
      font-family: ${font.mono};
      font-size: 11.5px;
      min-width: 0;
      padding: 4px 6px;
      resize: vertical;
    `,
    destructiveNote: css`
      color: ${warning};
      font-size: 11.5px;
      margin: 0;
    `,
    errorText: css`
      color: ${t(colors.red[600], colors.red[500])};
      margin: 4px 0 0 0;
    `,
    disabledButton: css`
      cursor: not-allowed;
      opacity: 0.5;
    `,

    // ---- tooltip.tsx ----
    tooltipWrapper: css`
      display: inline-flex;
      flex-shrink: 0;
      position: relative;
    `,
    tooltipBubble: css`
      background: ${t(colors.gray[100], colors.darkGray[500])};
      border: 1px solid ${t(colors.gray[300], colors.gray[600])};
      border-radius: 4px;
      color: ${text};
      font-family: ${font.sans};
      font-size: 11px;
      font-weight: 400;
      left: 50%;
      padding: 2px 8px;
      position: absolute;
      text-transform: none;
      top: 100%;
      transform: translate(-50%, 8px);
      white-space: nowrap;
      z-index: 1;
    `,
    tooltipArrowBorder: css`
      border-color: transparent;
      border-style: solid;
      border-width: 7px;
      height: 0;
      left: 50%;
      position: absolute;
      top: 0;
      width: 0;
      border-bottom-color: ${t(colors.gray[300], colors.gray[600])};
      transform: translate(-50%, -100%);
    `,
    tooltipArrowFill: css`
      border-color: transparent;
      border-style: solid;
      border-width: 7px;
      height: 0;
      left: 50%;
      position: absolute;
      top: 0;
      width: 0;
      border-bottom-color: ${t(colors.gray[100], colors.darkGray[500])};
      transform: translate(-50%, calc(-100% + 2px));
    `,
  };
};

export type Styles = ReturnType<typeof stylesFactory>;

/**
 * Theme-reactive styles, form-devtools pattern: reads the devtools-ui
 * theme context and rebuilds the class set when it flips.
 */
export function useStyles() {
  const { theme } = createTheme();
  const [styles, setStyles] = createSignal(stylesFactory(theme()));
  createEffect(() => {
    setStyles(stylesFactory(theme()));
  });
  return styles;
}
