#!/usr/bin/env node

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

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

/**
 * Generate a self-contained HTML comparison report for VRT failures.
 * Usage: node generate-vrt-report.mjs <report-dir>
 *
 * Reads the organized failure structure from report-dir/failures/
 * and produces report-dir/report.html with base64-embedded images.
 */

const MAX_FAILURES = 100;

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function readImageAsBase64(filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn(`Warning: failed to read image ${filePath}:`, err.message);
    }
    return null;
  }
}

async function collectFailures(failuresDir) {
  const failures = [];
  let componentDirs;

  try {
    componentDirs = await fs.readdir(failuresDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return failures;
    throw err;
  }

  for (const componentEntry of componentDirs) {
    if (!componentEntry.isDirectory()) continue;
    const component = componentEntry.name;
    const componentPath = path.join(failuresDir, component);

    let screenshotDirs;
    try {
      screenshotDirs = await fs.readdir(componentPath, {
        withFileTypes: true,
      });
    } catch (err) {
      console.warn(`Warning: failed to read ${componentPath}:`, err.message);
      continue;
    }

    for (const screenshotEntry of screenshotDirs) {
      if (!screenshotEntry.isDirectory()) continue;
      if (failures.length >= MAX_FAILURES) break;

      const screenshotName = screenshotEntry.name;
      const screenshotPath = path.join(componentPath, screenshotName);

      const expected = await readImageAsBase64(
        path.join(screenshotPath, 'expected.png'),
      );
      const actual = await readImageAsBase64(
        path.join(screenshotPath, 'actual.png'),
      );

      // Detect theme from screenshot name
      let theme = 'unknown';
      if (screenshotName.includes('-dark')) theme = 'dark';
      else if (screenshotName.includes('-light')) theme = 'light';

      failures.push({
        component,
        screenshotName,
        theme,
        expected,
        actual,
      });
    }
    if (failures.length >= MAX_FAILURES) break;
  }

  return failures;
}

function groupByComponent(failures) {
  const groups = {};
  for (const f of failures) {
    if (!groups[f.component]) groups[f.component] = [];
    groups[f.component].push(f);
  }
  return groups;
}

function generateHTML(failures, totalFound) {
  const grouped = groupByComponent(failures);
  const components = Object.keys(grouped).sort();
  const themes = [...new Set(failures.map((f) => f.theme))].sort();

  const failuresJSON = JSON.stringify(
    failures.map((f, i) => ({
      index: i,
      component: f.component,
      screenshotName: f.screenshotName,
      theme: f.theme,
    })),
  );

  const overflowNote =
    totalFound > MAX_FAILURES
      ? `<div class="overflow-note">Showing ${MAX_FAILURES} of ${totalFound} failures. Fix the most common failures first.</div>`
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>VRT Failure Report</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0d1117; color: #c9d1d9; }

  .header { padding: 16px 24px; background: #161b22; border-bottom: 1px solid #30363d; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .header h1 { font-size: 18px; font-weight: 600; }
  .header .stats { font-size: 14px; color: #8b949e; }

  .filters { display: flex; gap: 8px; margin-left: auto; }
  .filter-btn { padding: 4px 12px; border-radius: 16px; border: 1px solid #30363d; background: transparent; color: #c9d1d9; cursor: pointer; font-size: 12px; }
  .filter-btn.active { background: #1f6feb; border-color: #1f6feb; color: #fff; }

  .sidebar { position: fixed; left: 0; top: 0; bottom: 0; width: 280px; background: #161b22; border-right: 1px solid #30363d; overflow-y: auto; padding-top: 60px; }
  .sidebar-group { margin-bottom: 4px; }
  .sidebar-group-header { padding: 8px 12px; font-size: 12px; font-weight: 600; color: #8b949e; text-transform: uppercase; display: flex; justify-content: space-between; }
  .sidebar-group-header .count { background: #30363d; padding: 1px 6px; border-radius: 10px; font-size: 11px; }
  .sidebar-item { padding: 6px 12px 6px 20px; font-size: 13px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-left: 3px solid transparent; }
  .sidebar-item:hover { background: #1c2128; }
  .sidebar-item.active { background: #1c2128; border-left-color: #1f6feb; color: #fff; }
  .sidebar-item .theme-badge { font-size: 10px; padding: 1px 4px; border-radius: 4px; margin-left: 4px; }
  .theme-dark { background: #21262d; color: #8b949e; }
  .theme-light { background: #3d4450; color: #c9d1d9; }

  .main { margin-left: 280px; padding: 16px 24px; }
  .main .header { position: fixed; top: 0; left: 280px; right: 0; z-index: 10; }
  .main .content { margin-top: 64px; }

  .failure-card { display: none; }
  .failure-card.active { display: block; }

  .card-header { margin-bottom: 12px; }
  .card-header h2 { font-size: 16px; font-weight: 600; }
  .card-header .meta { font-size: 13px; color: #8b949e; margin-top: 4px; }

  .view-tabs { display: flex; gap: 4px; margin-bottom: 12px; }
  .view-tab { padding: 6px 16px; border-radius: 6px; border: 1px solid #30363d; background: transparent; color: #c9d1d9; cursor: pointer; font-size: 13px; }
  .view-tab.active { background: #1f6feb; border-color: #1f6feb; color: #fff; }
  .view-tab kbd { font-size: 11px; opacity: 0.7; margin-left: 4px; }

  .image-container { background: #010409; border: 1px solid #30363d; border-radius: 8px; overflow: hidden; position: relative; }
  .image-container img { max-width: 100%; display: block; }
  .image-container .no-image { padding: 40px; text-align: center; color: #484f58; }
  .view-panel { display: none; }
  .view-panel.active { display: block; }

  .keyboard-help { position: fixed; bottom: 12px; right: 12px; background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 12px; font-size: 12px; color: #8b949e; z-index: 20; }
  .keyboard-help kbd { background: #21262d; padding: 1px 6px; border-radius: 3px; border: 1px solid #30363d; font-family: monospace; color: #c9d1d9; }

  .overflow-note { padding: 12px; background: #1c1206; border: 1px solid #6e4600; border-radius: 6px; margin-bottom: 16px; font-size: 13px; }
</style>
</head>
<body>

<div class="sidebar" id="sidebar">
  ${components
    .map(
      (comp) => `
  <div class="sidebar-group" data-component="${escapeHTML(comp)}">
    <div class="sidebar-group-header">${escapeHTML(comp)} <span class="count">${grouped[comp].length}</span></div>
    ${grouped[comp]
      .map(
        (f) => `
    <div class="sidebar-item" data-index="${failures.indexOf(f)}" data-theme="${escapeHTML(f.theme)}">
      ${escapeHTML(f.screenshotName)}
      <span class="theme-badge theme-${escapeHTML(f.theme)}">${escapeHTML(f.theme)}</span>
    </div>`,
      )
      .join('')}
  </div>`,
    )
    .join('')}
</div>

<div class="main">
  <div class="header">
    <h1>VRT Failure Report</h1>
    <span class="stats">${failures.length} failure${failures.length === 1 ? '' : 's'} across ${components.length} component${components.length === 1 ? '' : 's'}</span>
    <div class="filters">
      <button class="filter-btn active" data-filter="all">All</button>
      ${components.map((c) => `<button class="filter-btn" data-filter="component:${escapeHTML(c)}">${escapeHTML(c)}</button>`).join('')}
      ${themes.filter((t) => t !== 'unknown').map((t) => `<button class="filter-btn" data-filter="theme:${escapeHTML(t)}">${escapeHTML(t)}</button>`).join('')}
    </div>
  </div>

  <div class="content">
    ${overflowNote}

    ${failures
      .map(
        (f, i) => `
    <div class="failure-card" data-index="${i}" data-component="${escapeHTML(f.component)}" data-theme="${escapeHTML(f.theme)}" id="failure-${i}">
      <div class="card-header">
        <h2>${escapeHTML(f.component)} / ${escapeHTML(f.screenshotName)}</h2>
        <div class="meta">Theme: ${escapeHTML(f.theme)}</div>
      </div>

      <div class="view-tabs">
        <button class="view-tab active" data-view="expected">Expected <kbd>1</kbd></button>
        <button class="view-tab" data-view="actual">Actual <kbd>2</kbd></button>
      </div>

      <div class="image-container">
        <div class="view-panel active" data-view="expected">
          ${f.expected ? `<img src="${f.expected}" alt="Expected">` : '<div class="no-image">No expected image</div>'}
        </div>
        <div class="view-panel" data-view="actual">
          ${f.actual ? `<img src="${f.actual}" alt="Actual">` : '<div class="no-image">No actual image</div>'}
        </div>
      </div>
    </div>`,
      )
      .join('\n')}
  </div>
</div>

<div class="keyboard-help">
  <kbd>j</kbd> / <kbd>k</kbd> navigate &nbsp;
  <kbd>1</kbd> expected &nbsp;
  <kbd>2</kbd> actual
</div>

<script>
(function() {
  const failures = ${failuresJSON};
  let currentIndex = 0;
  let currentView = 'expected';
  let activeFilter = 'all';

  function setView(view) {
    currentView = view;
    const card = document.getElementById('failure-' + currentIndex);
    if (!card) return;
    card.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
    const panel = card.querySelector('.view-panel[data-view="' + view + '"]');
    if (panel) panel.classList.add('active');
    card.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
    const tab = card.querySelector('.view-tab[data-view="' + view + '"]');
    if (tab) tab.classList.add('active');
  }

  function getVisibleIndices() {
    return failures
      .filter(f => {
        if (activeFilter === 'all') return true;
        if (activeFilter.startsWith('component:')) return f.component === activeFilter.split(':')[1];
        if (activeFilter.startsWith('theme:')) return f.theme === activeFilter.split(':')[1];
        return true;
      })
      .map(f => f.index);
  }

  function activateFailure(index) {
    document.querySelectorAll('.failure-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));

    const card = document.getElementById('failure-' + index);
    if (card) {
      card.classList.add('active');
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const sidebarItem = document.querySelector('.sidebar-item[data-index="' + index + '"]');
    if (sidebarItem) {
      sidebarItem.classList.add('active');
      sidebarItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    currentIndex = index;
    setView(currentView);
  }

  function applyFilter(filter) {
    activeFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="' + filter + '"]')?.classList.add('active');

    document.querySelectorAll('.sidebar-item').forEach(item => {
      const idx = parseInt(item.dataset.index);
      const f = failures[idx];
      let visible = true;
      if (filter.startsWith('component:')) visible = f.component === filter.split(':')[1];
      else if (filter.startsWith('theme:')) visible = f.theme === filter.split(':')[1];
      item.style.display = visible ? '' : 'none';
    });

    document.querySelectorAll('.sidebar-group').forEach(group => {
      const hasVisible = group.querySelector('.sidebar-item:not([style*="display: none"])');
      group.style.display = hasVisible ? '' : 'none';
    });

    const visible = getVisibleIndices();
    if (visible.length > 0) activateFailure(visible[0]);
  }

  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => activateFailure(parseInt(item.dataset.index)));
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.view-tab');
    if (tab) setView(tab.dataset.view);
  });

  document.addEventListener('keydown', (e) => {
    const visible = getVisibleIndices();
    const pos = visible.indexOf(currentIndex);

    switch(e.key) {
      case 'j':
        if (pos < visible.length - 1) activateFailure(visible[pos + 1]);
        e.preventDefault();
        break;
      case 'k':
        if (pos > 0) activateFailure(visible[pos - 1]);
        e.preventDefault();
        break;
      case '1':
        setView('expected');
        e.preventDefault();
        break;
      case '2':
        setView('actual');
        e.preventDefault();
        break;
    }
  });

  if (failures.length > 0) activateFailure(0);
})();
</script>
</body>
</html>`;
}

async function main() {
  const reportDir = process.argv[2];

  if (!reportDir) {
    console.error('Usage: node generate-vrt-report.mjs <report-dir>');
    process.exit(1);
  }

  const resolvedDir = path.resolve(reportDir);
  const failuresDir = path.join(resolvedDir, 'failures');

  let totalFound = 0;
  let components;
  try {
    components = await fs.readdir(failuresDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('No failures directory found. Nothing to report.');
      process.exit(0);
    }
    throw err;
  }

  for (const comp of components) {
    if (!comp.isDirectory()) continue;
    const screenshots = await fs.readdir(path.join(failuresDir, comp.name), {
      withFileTypes: true,
    });
    totalFound += screenshots.filter((s) => s.isDirectory()).length;
  }

  if (totalFound === 0) {
    console.log('No failures found. Nothing to report.');
    process.exit(0);
  }

  const failures = await collectFailures(failuresDir);
  const html = generateHTML(failures, totalFound);

  const reportPath = path.join(resolvedDir, 'report.html');
  await fs.writeFile(reportPath, html, 'utf8');

  console.log(`Generated report: ${reportPath}`);
  console.log(
    `${failures.length} failure${failures.length === 1 ? '' : 's'} included`,
  );
}

main().catch((err) => {
  console.error('Failed to generate VRT report:', err);
  process.exit(1);
});
