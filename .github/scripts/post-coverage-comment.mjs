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

import fs from 'node:fs';
import path from 'node:path';
import { Octokit } from 'octokit';

const COVERAGE_BASE =
  process.env.BASE_COVERAGE_SUMMARY_FILE ??
  'coverage/base-coverage-summary.json';
const COVERAGE_PR =
  process.env.COVERAGE_SUMMARY_FILE ?? 'coverage/coverage-summary.json';
const METRICS = ['lines', 'statements', 'functions', 'branches'];

const emptyStats = () => ({
  lines: { total: 0, covered: 0, skipped: 0, pct: 0 },
  statements: { total: 0, covered: 0, skipped: 0, pct: 0 },
  functions: { total: 0, covered: 0, skipped: 0, pct: 0 },
  branches: { total: 0, covered: 0, skipped: 0, pct: 0 },
});
const getFile = (file) =>
  fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8');

function buildTable(pkg, base, pr) {
  const noDiff = METRICS.every(
    (metric) => formatPct(base[metric].pct) === formatPct(pr[metric].pct),
  );

  // NOTE: only show a table if there is change in coverage; reduce "noise"
  if (noDiff) {
    return `\`${pkg}\` (No diff)`;
  }

  return [
    `\`${pkg}\`\n`,
    '| metric | current | base | change |',
    '| ------ | ------- | ---- | ------ |',
    ...METRICS.map(
      (metric) =>
        `| ${[
          metric,
          `${formatPct(pr[metric].pct)}%`,
          `${formatPct(base[metric].pct)}%`,
          formatPct(pr[metric].pct - base[metric].pct),
        ]
          .join(' | ')
          .trim()} |`,
    ),
  ].join('\n');
}

function formatPct(pct) {
  // NOTE: undefined and "Unknown" values replaced with "0" (zero)
  const num = Number.parseFloat(`${pct}`.replace(/^un/i, '0'));

  return !Number.isNaN(num) && Number.isFinite(num) ? num.toFixed(2) : '0';
}

function main() {
  const branchPR = JSON.parse(getFile(COVERAGE_PR) ?? '{}');
  const branchBase = JSON.parse(getFile(COVERAGE_BASE) ?? '{}');

  const packages = Object.keys(branchPR).sort();

  return postComment(
    [
      '## 📊 Coverage Reports\n',

      '\n### Coverage Changes by Package\n',
      `<details>\n<summary>Click to expand ${packages.length} package details</summary>`,

      // package reports
      packages.reduce(
        (acc, pkg) =>
          `${acc}\n${buildTable(pkg, branchBase[pkg] || emptyStats(), branchPR[pkg])}\n`,
        '',
      ),

      '</details>',

      '\n<sub>Coverage data collected from all packages in the monorepo.</sub>',
    ].join('\n'),
  );
}

async function postComment(comment) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error('GITHUB_TOKEN is required');
  }

  const octokit = new Octokit({ auth: token });
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

  let prNumber;
  const ref = process.env.GITHUB_REF;

  if (ref?.startsWith('refs/pull/')) {
    prNumber = Number.parseInt(ref.split('/')[2], 10);
  }

  if (!prNumber && process.env.GITHUB_EVENT_PATH) {
    try {
      const event = JSON.parse(
        fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf-8'),
      );

      prNumber = event.pull_request?.number || event.issue?.number;
    } catch (e) {
      console.log('⚠️ Could not parse GITHUB_EVENT_PATH:', e);
    }
  }

  if (!prNumber) {
    throw new Error('Could not determine PR number');
  }

  const { data: comments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    ['issue_number']: prNumber,
  });

  const botComment = comments.find(
    (c) => c.user.type === 'Bot' && c.body.includes('📊 Coverage Report'),
  );

  if (botComment) {
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      ['comment_id']: botComment.id,
      body: comment,
    });
    console.log('📝 Updated existing coverage comment');
  } else {
    await octokit.rest.issues.createComment({
      owner,
      repo,
      ['issue_number']: prNumber,
      body: comment,
    });
    console.log('💬 Created new coverage comment');
  }
}

main().catch((err) => {
  console.error('❌ Failed to post coverage comment:', err);
  process.exit(1);
});
