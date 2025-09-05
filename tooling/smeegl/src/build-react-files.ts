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
import { fileURLToPath } from 'node:url';
import ora from 'ora';
import { logMsg } from './log-messages.js';
import { mergeSvgIntoReactTemplate } from './utils/merge-svg-into-react-template.js';
import { pascalCase } from './utils/pascal-case.js';
import type { FindSpritesResult } from './utils/types.js';

// Paths
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export function buildReactFiles(
  findSpriteResult: FindSpritesResult,
  inputPath: string,
  outputPath: string,
) {
  const spinner = ora('Building React SVG Component files');
  spinner.start();

  // Ensure output directory exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const { sprites } = findSpriteResult.unwrapOr({ sprites: [] });

  const entryMap = new Map();

  for (const sprite of sprites) {
    const svgParent =
      sprite.parentPath !== inputPath
        ? sprite.parentPath.split(path.sep).pop()
        : '';

    const svgContent = fs.readFileSync(sprite.filePath, 'utf8');

    const svgName = [svgParent, sprite.name].filter((it) => !!it).join('-');

    // Write the updated SVG to the output directory
    const outputFileName = `${svgName}.tsx`;
    const outputFilePath = path.join(outputPath, outputFileName);
    const componentName = `Svg${pascalCase(svgName)}`;

    // Replace color in SVG content
    const outputContentFinal = mergeSvgIntoReactTemplate(
      componentName,
      svgContent,
    );

    fs.writeFileSync(outputFilePath, outputContentFinal, 'utf8');

    entryMap.set(componentName, svgName);

    logMsg(
      `Created ${svgName}.svg -> ${path.relative(process.cwd(), outputFilePath)}`,
      spinner,
    );
  }

  spinner.succeed();

  const outputIndexFile = path.join(outputPath, 'index.ts');

  spinner.text = `Building barrel index file ${outputIndexFile}`;

  const indexFileContent = [...entryMap.entries()].reduce(
    (acc, [componentName, svgName]) => {
      const line = `export { ${componentName} } from './${svgName}';`;
      return `${acc}${line}\n`;
    },
    '',
  );

  logMsg(`Creating index file ${outputIndexFile}`, spinner);

  fs.writeFileSync(outputIndexFile, indexFileContent, 'utf8');

  spinner.succeed('Build Complete');
}
