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

import * as fs from 'node:fs';
import * as path from 'node:path';
import { formatBytes } from './heap-snapshot';
import type { BaselineComparison, BaselineData } from './baseline';
import type { LeakInfo, MemlabReport, RetainerPathItem } from './types';

/**
 * Escape HTML special characters to prevent XSS and display raw HTML strings
 */
function escapeHtml(str: string): string {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Generate an HTML report from MemLab analysis results
 */
export function generateHtmlReport(
  reports: MemlabReport[],
  baseline?: BaselineData | null,
  comparisons?: BaselineComparison[],
): string {
  const timestamp = new Date().toISOString();
  const passedCount = reports.filter((r) => r.passed).length;
  const failedCount = reports.length - passedCount;

  const totalLeaks = reports.reduce((sum, r) => sum + r.leakCount, 0);
  const totalRetained = reports.reduce(
    (sum, r) => sum + r.totalRetainedSize,
    0,
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MemLab Memory Leak Report</title>
  <style>
    /* Design Foundation Tokens - Light Theme */
    :root {
      /* Surface */
      --bg-surface-default: #eff1f2;
      --bg-surface-raised: #ffffff;
      --bg-surface-muted: rgba(0, 0, 0, 0.08);

      /* Text */
      --fg-primary-bold: #212223;
      --fg-primary-muted: #565759;
      --fg-inverse-bold: #ffffff;
      --fg-a11y-on-accent: #ffffff;

      /* Utility Colors - Normal (Success/Passed) */
      --fg-normal-bold: #2bbf35;
      --bg-normal-muted: #c2f5c5;

      /* Utility Colors - Critical (Error/Failed) */
      --fg-critical-bold: #ff2e27;
      --bg-critical-muted: #ffc4c2;

      /* Utility Colors - Advisory (Info) */
      --fg-advisory-bold: #3c67a0;
      --bg-advisory-muted: #c4deff;

      /* Accent Primary */
      --bg-accent-primary-bold: #004f7e;
      --bg-accent-primary-pressed: #002C52;

      /* Borders/Outlines */
      --outline-static: #c3c5c7;

      /* Shadows */
      --shadow-elevation-raised: 0 1px 4px 0 rgba(0, 0, 0, 0.16);
      --shadow-elevation-overlay: 0 4px 8px 0 rgba(0, 0, 0, 0.16);

      /* Radius */
      --radius-small: 2px;
      --radius-medium: 4px;
      --radius-large: 8px;
      --radius-round: 9999px;

      /* Spacing */
      --spacing-xs: 4px;
      --spacing-s: 8px;
      --spacing-m: 12px;
      --spacing-l: 16px;
      --spacing-xl: 24px;
      --spacing-xxl: 32px;
    }

    /* Dark Theme */
    @media (prefers-color-scheme: dark) {
      :root {
        /* Surface */
        --bg-surface-default: #151517;
        --bg-surface-raised: #212223;
        --bg-surface-muted: rgba(255, 255, 255, 0.08);

        /* Text */
        --fg-primary-bold: #ffffff;
        --fg-primary-muted: #c3c5c7;
        --fg-inverse-bold: #212223;
        --fg-a11y-on-accent: #ffffff;

        /* Utility Colors - Normal (Success/Passed) */
        --fg-normal-bold: #2bbf35;
        --bg-normal-muted: #08210a;

        /* Utility Colors - Critical (Error/Failed) */
        --fg-critical-bold: #ff2e27;
        --bg-critical-muted: #290200;

        /* Utility Colors - Advisory (Info) */
        --fg-advisory-bold: #62a6ff;
        --bg-advisory-muted: #0e1825;

        /* Accent Primary */
        --bg-accent-primary-bold: #004f7e;
        --bg-accent-primary-pressed: #002C52;

        /* Borders/Outlines */
        --outline-static: #414245;

        /* Shadows */
        --shadow-elevation-raised: 0 1px 4px 0 rgba(0, 0, 0, 0.80);
        --shadow-elevation-overlay: 0 4px 8px 0 rgba(0, 0, 0, 0.80);
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: var(--fg-primary-bold);
      background: var(--bg-surface-default);
      padding: var(--spacing-xxl);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      background: var(--bg-accent-primary-bold);
      color: var(--fg-a11y-on-accent);
      padding: var(--spacing-xxl);
      border-radius: var(--radius-large);
      margin-bottom: var(--spacing-xxl);
      box-shadow: var(--shadow-elevation-raised);
    }

    header h1 {
      font-size: 2rem;
      margin-bottom: var(--spacing-s);
    }

    header .timestamp {
      opacity: 0.8;
      font-size: 0.9rem;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-l);
      margin-bottom: var(--spacing-xxl);
    }

    .summary-card {
      background: var(--bg-surface-raised);
      padding: var(--spacing-xl);
      border-radius: var(--radius-large);
      box-shadow: var(--shadow-elevation-raised);
    }

    .summary-card h3 {
      font-size: 0.875rem;
      color: var(--fg-primary-muted);
      margin-bottom: var(--spacing-s);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .summary-card .value {
      font-size: 2rem;
      font-weight: 700;
    }

    .summary-card.passed .value { color: var(--fg-normal-bold); }
    .summary-card.failed .value { color: var(--fg-critical-bold); }
    .summary-card.info .value { color: var(--fg-advisory-bold); }

    .components {
      display: grid;
      gap: var(--spacing-l);
    }

    .component-card {
      background: var(--bg-surface-raised);
      border-radius: var(--radius-large);
      overflow: hidden;
      box-shadow: var(--shadow-elevation-raised);
    }

    .component-header {
      padding: var(--spacing-l) var(--spacing-xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--outline-static);
    }

    .component-header h2 {
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      gap: var(--spacing-s);
    }

    .status-badge {
      padding: var(--spacing-xs) var(--spacing-m);
      border-radius: var(--radius-round);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.passed {
      background: var(--bg-normal-muted);
      color: var(--fg-normal-bold);
    }

    .status-badge.failed {
      background: var(--bg-critical-muted);
      color: var(--fg-critical-bold);
    }

    .component-body {
      padding: var(--spacing-xl);
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--spacing-l);
      margin-bottom: var(--spacing-l);
    }

    .metric {
      padding: var(--spacing-l);
      background: var(--bg-surface-muted);
      border-radius: var(--radius-medium);
    }

    .metric-label {
      font-size: 0.75rem;
      color: var(--fg-primary-muted);
      margin-bottom: var(--spacing-xs);
    }

    .metric-value {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .leaks-list {
      margin-top: var(--spacing-l);
    }

    .leaks-list h4 {
      font-size: 0.875rem;
      color: var(--fg-primary-muted);
      margin-bottom: var(--spacing-s);
    }

    .leak-item {
      display: block;
      padding: var(--spacing-s);
      background: var(--bg-critical-muted);
      border-radius: var(--radius-small);
      margin-bottom: var(--spacing-s);
      font-size: 0.875rem;
    }

    .leak-item .name {
      color: var(--fg-critical-bold);
    }

    .leak-item .size {
      color: var(--fg-primary-muted);
    }

    .baseline-comparison {
      margin-top: var(--spacing-l);
      padding: var(--spacing-l);
      background: var(--bg-advisory-muted);
      border-radius: var(--radius-medium);
    }

    .baseline-comparison h4 {
      font-size: 0.875rem;
      color: var(--fg-advisory-bold);
      margin-bottom: var(--spacing-s);
    }

    .delta {
      font-size: 0.875rem;
      padding: var(--spacing-xs) var(--spacing-s);
      border-radius: var(--radius-small);
    }

    .delta.positive {
      background: var(--bg-critical-muted);
      color: var(--fg-critical-bold);
    }

    .delta.negative {
      background: var(--bg-normal-muted);
      color: var(--fg-normal-bold);
    }

    .delta.neutral {
      background: var(--bg-surface-muted);
      color: var(--fg-primary-muted);
    }

    footer {
      margin-top: var(--spacing-xxl);
      text-align: center;
      color: var(--fg-primary-muted);
      font-size: 0.875rem;
    }

    .trend-chart {
      margin-top: var(--spacing-xxl);
      padding: var(--spacing-xl);
      background: var(--bg-surface-raised);
      border-radius: var(--radius-large);
      box-shadow: var(--shadow-elevation-raised);
    }

    .trend-chart h3 {
      margin-bottom: var(--spacing-l);
    }

    .chart-placeholder {
      height: 200px;
      background: var(--bg-surface-muted);
      border-radius: var(--radius-medium);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--fg-primary-muted);
    }

    /* Expandable leak trace styles */
    .leak-item {
      margin-bottom: var(--spacing-s);
    }

    .leak-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-s);
      background: var(--bg-critical-muted);
      border-radius: var(--radius-small);
      cursor: pointer;
      user-select: none;
    }

    .leak-header:hover {
      filter: brightness(0.95);
    }

    .leak-header .name {
      color: var(--fg-critical-bold);
      flex: 1;
      font-size: 0.875rem;
    }

    .leak-header .size {
      color: var(--fg-primary-muted);
      margin-left: var(--spacing-m);
      font-size: 0.875rem;
    }

    .leak-header .expand-icon {
      color: var(--fg-primary-muted);
      margin-left: var(--spacing-s);
      font-family: monospace;
      font-weight: bold;
      width: 1em;
      text-align: center;
    }

    .leak-trace {
      margin-top: var(--spacing-xs);
      margin-left: var(--spacing-l);
      padding: var(--spacing-m);
      background: var(--bg-surface-muted);
      border-radius: var(--radius-small);
      border-left: 3px solid var(--outline-static);
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      font-size: 0.75rem;
      overflow-x: auto;
      max-height: 400px;
      overflow-y: auto;
    }

    .trace-step {
      padding: var(--spacing-xs) 0;
      white-space: nowrap;
    }

    .trace-step:not(:last-child) {
      border-bottom: 1px solid var(--bg-surface-muted);
    }

    .trace-node {
      color: var(--fg-primary-bold);
    }

    .trace-node.leaked {
      color: var(--fg-critical-bold);
      font-weight: 600;
    }

    .trace-edge {
      color: var(--fg-advisory-bold);
      margin-right: var(--spacing-s);
    }

    .trace-meta {
      color: var(--fg-primary-muted);
      font-size: 0.7rem;
    }

    .trace-id {
      color: var(--fg-primary-muted);
      opacity: 0.7;
    }

    .trace-size {
      color: var(--fg-advisory-bold);
    }

    .leak-meta {
      display: flex;
      gap: var(--spacing-m);
      margin-top: var(--spacing-xs);
      font-size: 0.7rem;
      color: var(--fg-primary-muted);
    }

    .show-more-btn {
      margin-top: var(--spacing-s);
      padding: var(--spacing-xs) var(--spacing-s);
      background: var(--bg-surface-muted);
      border: 1px solid var(--outline-static);
      border-radius: var(--radius-small);
      cursor: pointer;
      font-size: 0.75rem;
      color: var(--fg-primary-muted);
    }

    .show-more-btn:hover {
      background: var(--bg-surface-raised);
    }
  </style>
  <script>
    function toggleTrace(header) {
      const trace = header.nextElementSibling;
      const icon = header.querySelector('.expand-icon');
      if (!trace || !trace.classList.contains('leak-trace')) return;

      if (trace.style.display === 'none' || !trace.style.display) {
        trace.style.display = 'block';
        icon.textContent = '−';
      } else {
        trace.style.display = 'none';
        icon.textContent = '+';
      }
    }

    function showMoreSteps(btn, leakIdx) {
      const container = btn.previousElementSibling;
      const hiddenSteps = container.querySelectorAll('.trace-step.hidden');
      hiddenSteps.forEach(step => step.classList.remove('hidden'));
      hiddenSteps.forEach(step => step.style.display = 'block');
      btn.style.display = 'none';
    }
  </script>
</head>
<body>
  <div class="container">
    <header>
      <h1>🔬 MemLab Memory Leak Report</h1>
      <p class="timestamp">Generated: ${timestamp}</p>
    </header>

    <div class="summary">
      <div class="summary-card passed">
        <h3>Passed</h3>
        <div class="value">${passedCount}</div>
      </div>
      <div class="summary-card failed">
        <h3>Failed</h3>
        <div class="value">${failedCount}</div>
      </div>
      <div class="summary-card info">
        <h3>Total Leaks</h3>
        <div class="value">${totalLeaks}</div>
      </div>
      <div class="summary-card info">
        <h3>Total Retained</h3>
        <div class="value">${formatBytes(totalRetained)}</div>
      </div>
    </div>

    <div class="components">
      ${reports
        .map((report) =>
          generateComponentCard(
            report,
            comparisons?.find((c) => c.component === report.component),
          ),
        )
        .join('\n')}
    </div>

    ${baseline?.history?.length ? generateTrendSection(baseline) : ''}

    <footer>
      <p>Generated by MemLab Memory Leak Testing Framework</p>
      <p>© ${new Date().getFullYear()} Hypergiant Galactic Systems Inc.</p>
    </footer>
  </div>
</body>
</html>`;
}

function generateComponentCard(
  report: MemlabReport,
  comparison?: BaselineComparison,
): string {
  const statusClass = report.passed ? 'passed' : 'failed';
  const statusText = report.passed ? 'PASSED' : 'FAILED';

  return `
    <div class="component-card">
      <div class="component-header">
        <h2>
          ${report.passed ? '✅' : '❌'} ${report.component}
        </h2>
        <span class="status-badge ${statusClass}">${statusText}</span>
      </div>
      <div class="component-body">
        <div class="metrics">
          <div class="metric">
            <div class="metric-label">Leak Count</div>
            <div class="metric-value">${report.leakCount} / ${report.threshold.maxLeakedObjects}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Retained Size</div>
            <div class="metric-value">${formatBytes(report.totalRetainedSize)}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Threshold</div>
            <div class="metric-value">${formatBytes(report.threshold.maxRetainedSize)}</div>
          </div>
        </div>

        ${report.leaks.length > 0 ? generateLeaksList(report.leaks) : '<p style="color: var(--fg-normal-bold);">No memory leaks detected!</p>'}

        ${comparison ? generateBaselineComparison(comparison) : ''}

        ${report.threshold.notes ? `<p style="margin-top: var(--spacing-l); font-size: 0.875rem; color: var(--fg-primary-muted);"><strong>Notes:</strong> ${report.threshold.notes}</p>` : ''}
      </div>
    </div>
  `;
}

/**
 * Generate HTML for a single retainer path step
 */
function generateTraceStep(
  step: RetainerPathItem,
  index: number,
  isFirst: boolean,
  isHidden: boolean,
): string {
  const hiddenClass = isHidden ? 'hidden" style="display: none;' : '';
  const leakedClass = isFirst ? ' leaked' : '';

  // Format the edge (if not first step)
  const edgeHtml = step.edgeName
    ? `<span class="trace-edge">--${escapeHtml(step.edgeName)} (${escapeHtml(step.edgeType || 'unknown')})${step.edgeRetainSize ? ` [${formatBytes(step.edgeRetainSize)}]` : ''}→</span>`
    : '';

  // Format the node
  const nodeHtml = `<span class="trace-node${leakedClass}">[${escapeHtml(step.nodeName)}](${escapeHtml(step.nodeType)})</span>`;

  // Format metadata (ID and retained size)
  const metaHtml = `<span class="trace-meta"> <span class="trace-id">@${step.nodeId}</span>${step.retainedSize ? ` <span class="trace-size">${formatBytes(step.retainedSize)}</span>` : ''}</span>`;

  return `
    <div class="trace-step ${hiddenClass}">
      <span style="color: var(--fg-primary-muted);">${index}:</span>
      ${edgeHtml}
      ${nodeHtml}
      ${metaHtml}
    </div>
  `;
}

/**
 * Generate HTML for the retainer trace
 */
function generateRetainerTrace(leak: LeakInfo, leakIndex: number): string {
  if (!leak.retainerPath || leak.retainerPath.length === 0) {
    return '';
  }

  const maxVisibleSteps = 8;
  const hasMoreSteps = leak.retainerPath.length > maxVisibleSteps;

  const stepsHtml = leak.retainerPath
    .map((step, idx) =>
      generateTraceStep(step, idx, idx === 0, idx >= maxVisibleSteps),
    )
    .join('');

  const showMoreBtn = hasMoreSteps
    ? `<button class="show-more-btn" onclick="showMoreSteps(this, ${leakIndex})">Show ${leak.retainerPath.length - maxVisibleSteps} more steps...</button>`
    : '';

  // Add meta information if available
  const metaItems: string[] = [];
  if (leak.dominatorId) {
    metaItems.push(`<span>Dominator: @${leak.dominatorId}</span>`);
  }
  if (leak.allocationLocation?.line) {
    const loc = leak.allocationLocation;
    metaItems.push(
      `<span>Allocated: ${loc.scriptId ? `script ${loc.scriptId}, ` : ''}line ${loc.line}${loc.column ? `:${loc.column}` : ''}</span>`,
    );
  }
  const metaHtml =
    metaItems.length > 0
      ? `<div class="leak-meta">${metaItems.join('')}</div>`
      : '';

  return `
    <div class="leak-trace" style="display: none;">
      <div class="trace-steps">
        ${stepsHtml}
      </div>
      ${showMoreBtn}
      ${metaHtml}
    </div>
  `;
}

/**
 * Generate HTML for a single leak item with expandable trace
 */
function generateLeakItem(leak: LeakInfo, index: number): string {
  const hasTrace = leak.retainerPath && leak.retainerPath.length > 0;

  return `
    <div class="leak-item">
      <div class="leak-header" onclick="toggleTrace(this)">
        <span class="name">${escapeHtml(leak.name || 'Unknown')}</span>
        <span class="size">${formatBytes(leak.retainedSize || 0)}</span>
        ${hasTrace ? '<span class="expand-icon">+</span>' : ''}
      </div>
      ${hasTrace ? generateRetainerTrace(leak, index) : ''}
    </div>
  `;
}

function generateLeaksList(leaks: LeakInfo[]): string {
  return `
    <div class="leaks-list">
      <h4>Detected Leaks (${leaks.length})</h4>
      ${leaks
        .slice(0, 10)
        .map((leak, idx) => generateLeakItem(leak, idx))
        .join('')}
      ${leaks.length > 10 ? `<p style="margin-top: var(--spacing-s); font-size: 0.75rem; color: var(--fg-primary-muted);">... and ${leaks.length - 10} more</p>` : ''}
    </div>
  `;
}

function generateBaselineComparison(comparison: BaselineComparison): string {
  const leakDeltaClass =
    comparison.leakCountDelta > 0
      ? 'positive'
      : comparison.leakCountDelta < 0
        ? 'negative'
        : 'neutral';
  const sizeDeltaClass =
    comparison.retainedSizeDelta > 0
      ? 'positive'
      : comparison.retainedSizeDelta < 0
        ? 'negative'
        : 'neutral';

  return `
    <div class="baseline-comparison">
      <h4>📊 Baseline Comparison</h4>
      <div style="display: flex; gap: var(--spacing-l); margin-top: var(--spacing-s);">
        <div>
          <span>Leaks: </span>
          <span class="delta ${leakDeltaClass}">
            ${comparison.leakCountDelta >= 0 ? '+' : ''}${comparison.leakCountDelta}
          </span>
          <span style="color: var(--fg-primary-muted); font-size: 0.75rem;"> vs baseline (${comparison.baselineLeakCount})</span>
        </div>
        <div>
          <span>Size: </span>
          <span class="delta ${sizeDeltaClass}">
            ${comparison.retainedSizeDelta >= 0 ? '+' : '-'}${formatBytes(Math.abs(comparison.retainedSizeDelta))}
          </span>
        </div>
      </div>
      ${comparison.isRegression ? '<p style="color: var(--fg-critical-bold); margin-top: var(--spacing-s); font-weight: 600;">⚠️ Regression detected</p>' : ''}
      ${comparison.isImprovement ? '<p style="color: var(--fg-normal-bold); margin-top: var(--spacing-s); font-weight: 600;">✅ Improvement detected</p>' : ''}
    </div>
  `;
}

function generateTrendSection(baseline: BaselineData): string {
  const history = baseline.history.slice(-10);

  return `
    <div class="trend-chart">
      <h3>📈 Historical Trend (Last ${history.length} runs)</h3>
      <div class="chart-placeholder">
        <table style="width: 100%; background: var(--bg-surface-raised); padding: var(--spacing-l);">
          <thead>
            <tr style="text-align: left; border-bottom: 1px solid var(--outline-static);">
              <th style="padding: var(--spacing-s);">Date</th>
              <th style="padding: var(--spacing-s);">Commit</th>
              <th style="padding: var(--spacing-s);">Components</th>
              <th style="padding: var(--spacing-s);">Total Leaks</th>
            </tr>
          </thead>
          <tbody>
            ${history
              .reverse()
              .map(
                (entry) => `
              <tr style="border-bottom: 1px solid var(--bg-surface-muted);">
                <td style="padding: var(--spacing-s); font-size: 0.875rem;">${new Date(entry.timestamp).toLocaleDateString()}</td>
                <td style="padding: var(--spacing-s); font-family: monospace; font-size: 0.75rem;">${entry.commitHash?.slice(0, 7) || 'N/A'}</td>
                <td style="padding: var(--spacing-s); font-size: 0.875rem;">${Object.keys(entry.components).join(', ')}</td>
                <td style="padding: var(--spacing-s); font-size: 0.875rem;">${Object.values(entry.components).reduce((sum, c) => sum + c.leakCount, 0)}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Save HTML report to file
 */
export function saveHtmlReport(
  reports: MemlabReport[],
  outputPath: string,
  baseline?: BaselineData | null,
  comparisons?: BaselineComparison[],
): void {
  const html = generateHtmlReport(reports, baseline, comparisons);
  const dir = path.dirname(outputPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`📄 HTML report saved to ${outputPath}`);
}

/**
 * Load all JSON reports from a directory
 */
export function loadReportsFromDirectory(reportsDir: string): MemlabReport[] {
  if (!fs.existsSync(reportsDir)) {
    return [];
  }

  const files = fs.readdirSync(reportsDir).filter((f) => f.endsWith('.json'));
  const reports: MemlabReport[] = [];

  for (const file of files) {
    let content: string;
    try {
      content = fs.readFileSync(path.join(reportsDir, file), 'utf-8');
    } catch {
      console.warn(`⚠️ Failed to read report file: ${file}`);
      continue;
    }
    try {
      reports.push(JSON.parse(content));
    } catch {
      console.warn(`⚠️ Failed to parse report JSON: ${file}`);
    }
  }

  return reports;
}
