#!/usr/bin/env node

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
import { pascalCase } from 'change-case';

// Paths

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.resolve(__dirname, 'ntds_config.json');
const fileTemplateFilename = path.resolve(__dirname, 'file_template.txt');
const fileTemplate = fs.readFileSync(fileTemplateFilename, 'utf8');
const outputDir = path.resolve(__dirname, '../../../../icons/map/ntds/color');

const coreSvgDir = path.resolve(__dirname, '../core');

// Read config
if (!fs.existsSync(configPath)) {
  console.error('Config file not found:', configPath);
  process.exit(1);
}

// Read all svg files in the core directory and subdirectories
if (!fs.existsSync(coreSvgDir)) {
  console.error('Core SVG directory not found:', coreSvgDir);
  process.exit(1);
}

// Read all SVG files in the core directory
// This assumes that the core directory contains SVG files directly
// If there are subdirectories, you may need to adjust this logic
const coreSvgFiles = fs
  .readdirSync(coreSvgDir, {
    withFileTypes: true,
    recursive: true,
  })
  .filter((it) => it.name.endsWith('.svg'));
if (!coreSvgFiles.length) {
  console.error('No SVG files found in core directory:', coreSvgDir);
  process.exit(1);
}

const coreSvgs = coreSvgFiles.map((file) => {
  const parent =
    file.parentPath !== coreSvgDir ? file.parentPath.split(path.sep).pop() : '';

  const filePath = parent
    ? path.join(coreSvgDir, parent, file.name)
    : path.join(coreSvgDir, file.name);

  const info = {
    filename: file.name,
    name: file.name.replace('.svg', ''),
    parent,
    content: fs.readFileSync(filePath, 'utf8'),
  };

  return info;
});

const svgs = coreSvgs.reduce((acc, svg) => {
  const key = svg.parent ? `${svg.parent}-${svg.name}` : svg.name;
  acc[key] = { ...svg };
  return acc;
}, {});

const { color_map, icon_map } = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// // Build output files based on config
for (const entry of Object.entries(icon_map)) {
  const [iconType, variations] = entry;

  for (const [variation, config] of Object.entries(variations)) {
    const svgKey = config.style ? `${iconType}-${config.style}` : iconType;

    if (!svgs[svgKey]) {
      console.warn(`SVG not found for key: ${svgKey}`);
      continue;
    }

    const color = color_map[variation];

    // Replace color in SVG content
    const svgContent = color
      ? svgs[svgKey].content.replace(/fill="[^"]*"/g, `fill="${color}"`)
      : svgs[svgKey].content;

    // Write the updated SVG to the output directory
    const outputFileName = `${iconType}-${variation}.tsx`;
    const outputFilePath = path.join(outputDir, outputFileName);

    const componentName = `Svg${pascalCase(iconType)}${pascalCase(variation)}`;

    const outputContent = fileTemplate
      .replace(/\_\_REPLACE_WITH_COMPONENT_NAME\_\_/g, componentName)
      .replace(/\_\_REPLACE_WITH_SVG_CONTENT\_\_/g, svgContent)
      .replace(
        'xmlns="http://www.w3.org/2000/svg"',
        'xmlns="http://www.w3.org/2000/svg" aria-labelledby=\'titleId\' {...props}',
      )
      .replace(
        '{...props}>',
        '{...props}> \n{title ? <title id={titleId}>{title}</title> : null}',
      );

    fs.writeFileSync(outputFilePath, outputContent, 'utf8');

    console.log(
      `Building ${iconType}-${variation}.svg from ${[iconType, config.style, variation].filter((x) => !!x)} -> ${path.relative(__dirname, outputFilePath)}`,
    );
  }
}

console.log('Build complete.');
