#!/usr/bin/env node
/**
 * Validate apps/docs/.index.json against file system
 *
 * Checks:
 * - Orphaned docs (in index but not on disk)
 * - Missing docs (on disk but not in index)
 * - Source files that no longer exist
 *
 * Exit codes:
 * 0 = no issues
 * 1 = warnings found
 * 2 = errors found
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = path.join(__dirname, '../apps/docs/.index.json');
const ROOT_DIR = path.join(__dirname, '..');

function main() {
  // Read index
  if (!fs.existsSync(INDEX_PATH)) {
    console.error('❌ Index file not found:', INDEX_PATH);
    process.exit(2);
  }

  const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
  console.log(`📋 Loaded index with ${index.entries.length} entries`);

  let warnings = 0;
  let errors = 0;

  // Check each entry
  for (const entry of index.entries) {
    const sourcePath = path.join(ROOT_DIR, entry.source);
    const docPath = path.join(ROOT_DIR, entry.doc);

    // Check source exists
    if (!fs.existsSync(sourcePath)) {
      console.warn(`⚠️  Source missing: ${entry.source}`);
      warnings++;
    }

    // Check doc exists (skip "pending" doc_sha entries)
    if (entry.doc_sha !== 'pending' && !fs.existsSync(docPath)) {
      console.error(`❌ Doc missing: ${entry.doc}`);
      errors++;
    }
  }

  // Check for orphaned docs (on disk but not in index)
  const docsDir = path.join(ROOT_DIR, 'apps/docs/content');
  if (fs.existsSync(docsDir)) {
    const allDocs = findAllDocs(docsDir);
    const indexedDocs = new Set(index.entries.map(e => path.normalize(e.doc)));

    for (const doc of allDocs) {
      const relativePath = path.relative(ROOT_DIR, doc);
      if (!indexedDocs.has(path.normalize(relativePath))) {
        console.warn(`⚠️  Orphaned doc (not in index): ${relativePath}`);
        warnings++;
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (errors === 0 && warnings === 0) {
    console.log('✅ All checks passed');
    process.exit(0);
  } else {
    console.log(`Found ${errors} errors, ${warnings} warnings`);
    process.exit(errors > 0 ? 2 : 1);
  }
}

function findAllDocs(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findAllDocs(fullPath));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      results.push(fullPath);
    }
  }

  return results;
}

main();
