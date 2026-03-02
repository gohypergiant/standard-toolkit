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

import { glob } from 'node:fs/promises';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

/**
 * Organize VRT failure artifacts into a clean directory structure.
 * Usage: node organize-vrt-failures.mjs <app-dir>
 *
 * Scans for -actual.png files in .vitest-attachments/ directories,
 * then collects the corresponding -diff.png and expected baseline
 * into a structured vrt-report/failures/ directory.
 */

async function main() {
  const appDir = process.argv[2];

  if (!appDir) {
    console.error('Usage: node organize-vrt-failures.mjs <app-dir>');
    process.exit(1);
  }

  const resolvedAppDir = path.resolve(appDir);
  const reportDir = path.join(resolvedAppDir, 'vrt-report');
  const failuresDir = path.join(reportDir, 'failures');

  // Vitest places .vitest-attachments/ at the app root, mirroring the src/ tree:
  //   apps/next/.vitest-attachments/src/features/{component}/{component}.visual.tsx/{name}-actual-chromium-linux.png
  // Baselines live at:
  //   apps/next/src/features/{component}/__screenshots__/{component}.visual.tsx/{name}-chromium-linux.png
  const pattern = path.join(
    resolvedAppDir,
    '.vitest-attachments/src/features/**/*-actual-*.png',
  );

  const actualFiles = [];
  for await (const entry of glob(pattern)) {
    actualFiles.push(entry);
  }

  if (actualFiles.length === 0) {
    console.log('No VRT failure artifacts found.');
    process.exit(0);
  }

  console.log(`Found ${actualFiles.length} failure(s)`);

  await fs.mkdir(failuresDir, { recursive: true });

  let organized = 0;

  for (const actualPath of actualFiles) {
    // Extract component from the mirrored path structure
    // .vitest-attachments/src/features/{component}/{component}.visual.tsx/{name}.png
    const attachmentsPrefix = '.vitest-attachments/src/features/';
    const attachIdx = actualPath.indexOf(attachmentsPrefix);
    if (attachIdx === -1) continue;

    const afterPrefix = actualPath.substring(
      attachIdx + attachmentsPrefix.length,
    );
    const component = afterPrefix.split('/')[0];

    // Derive screenshot name by stripping the -actual suffix
    // e.g., date-field-small-default-dark-actual-chromium-linux.png → date-field-small-default-dark
    const actualBasename = path.basename(actualPath, '.png');
    const screenshotName = actualBasename.replace(/-actual(-chromium-\w+)?$/, '');

    // Derive the platform suffix (e.g., "-chromium-linux")
    const platformMatch = actualBasename.match(/-actual(-chromium-\w+)$/);
    const platformSuffix = platformMatch ? platformMatch[1] : '';

    // Derive diff path (sibling with -diff instead of -actual)
    const diffPath = actualPath.replace(/-actual(-chromium-)/, '-diff$1');

    // Derive expected baseline path in the source tree
    // The visual test file path mirrors inside .vitest-attachments
    const relFromAttachments = afterPrefix; // e.g., date-field/date-field.visual.tsx/{name}.png
    const visualTestDir = path.dirname(relFromAttachments); // e.g., date-field/date-field.visual.tsx
    const expectedBasename = `${screenshotName}${platformSuffix}.png`;
    const expectedPath = path.join(
      resolvedAppDir,
      'src/features',
      path.dirname(visualTestDir), // component dir
      '__screenshots__',
      path.basename(visualTestDir), // {component}.visual.tsx
      expectedBasename,
    );

    // Create output directory
    const outputDir = path.join(failuresDir, component, screenshotName);
    await fs.mkdir(outputDir, { recursive: true });

    // Copy actual (always exists)
    await fs.copyFile(actualPath, path.join(outputDir, 'actual.png'));

    // Copy diff (may not exist)
    try {
      await fs.copyFile(diffPath, path.join(outputDir, 'diff.png'));
    } catch {
      // diff file may not exist for new screenshots
    }

    // Copy expected baseline (may not exist for new tests)
    try {
      await fs.copyFile(expectedPath, path.join(outputDir, 'expected.png'));
    } catch {
      // expected file may not exist for brand new tests
    }

    organized++;
  }

  // Copy test-results.json if it exists
  const testResultsPath = path.join(resolvedAppDir, 'test-results.json');
  try {
    await fs.copyFile(testResultsPath, path.join(reportDir, 'test-results.json'));
  } catch {
    // test-results.json may not exist
  }

  console.log(`Organized ${organized} failure(s) into ${failuresDir}`);
}

main().catch((err) => {
  console.error('Failed to organize VRT failures:', err);
  process.exit(1);
});
