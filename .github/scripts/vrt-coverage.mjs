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

const DESIGN_TOOLKIT_COMPONENTS = 'packages/design-toolkit/src/components';
const VRT_FEATURES = 'apps/next/src/features';
const CONFIG_PATH = 'apps/next/src/visual-regression/vrt-coverage.config.json';

async function getDirectories(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

async function getVrtTestFiles(dirPath) {
  const features = await getDirectories(dirPath);
  const covered = [];

  for (const feature of features) {
    const featurePath = path.join(dirPath, feature);
    const files = await fs.readdir(featurePath);
    const hasVisualTest = files.some((file) => file.endsWith('.visual.tsx'));
    if (hasVisualTest) {
      covered.push(feature);
    }
  }

  return covered;
}

async function loadConfig() {
  try {
    const content = await fs.readFile(CONFIG_PATH, 'utf8');
    return JSON.parse(content);
  } catch {
    return { exclude: [] };
  }
}

async function main() {
  const config = await loadConfig();
  const excludeSet = new Set(config.exclude || []);

  // Get all design-toolkit components
  const allComponents = await getDirectories(DESIGN_TOOLKIT_COMPONENTS);

  // Filter out excluded components
  const trackableComponents = allComponents.filter(
    (name) => !excludeSet.has(name),
  );

  // Get components with VRT tests
  const coveredComponents = await getVrtTestFiles(VRT_FEATURES);

  // Calculate coverage
  const coveredSet = new Set(coveredComponents);
  const missing = trackableComponents.filter((name) => !coveredSet.has(name));
  const covered = trackableComponents.filter((name) => coveredSet.has(name));

  const total = trackableComponents.length;
  const coveredCount = covered.length;
  const percentage = total > 0 ? Math.round((coveredCount / total) * 100) : 0;

  const result = {
    total,
    excluded: excludeSet.size,
    excludedComponents: [...excludeSet].sort(),
    covered: coveredCount,
    coveredComponents: covered.sort(),
    missing: missing.length,
    missingComponents: missing.sort(),
    percentage,
  };

  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error('Failed to generate VRT coverage:', err);
  process.exit(1);
});
