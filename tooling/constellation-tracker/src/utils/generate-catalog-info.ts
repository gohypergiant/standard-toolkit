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
import { trim } from 'radash';
import { template } from './catalog-info-template.js';

function generateUrls(repository: { url: string }, subPath: string) {
  const projectSlug = trim(new URL(repository?.url).pathname, '/');
  const isGithub = repository.url?.includes('github');

  const packageUrl = `${repository?.url}${isGithub ? `/tree/main/${subPath}` : `/-/tree/${subPath}`}`;
  const editUrl = `${repository?.url}${isGithub ? `/blob/main/${subPath}/catalog-info.yaml` : `/${subPath}/-/edit/main/catalog-info.yaml`}`;

  return {
    editUrl,
    projectSlug,
    packageUrl,
  };
}

export function generateCatalogInfo(packagePath: string) {
  const packageJsonContent = fs.readFileSync(packagePath, 'utf-8');
  const packageJson = JSON.parse(packageJsonContent);

  const catalogInfo = Object.assign({}, template);
  const isGithub = packageJson.repository.url?.includes('github.com');

  // Backstage limits us to alphanumeric, -, and _ characters
  // so we need to purge invalid characters from the package
  // name. We replace '@' with '' and '/' with '_'.
  catalogInfo.metadata.name = packageJson.name
    .replaceAll('@', '')
    .replaceAll('/', '_');
  catalogInfo.metadata.title = packageJson.title;
  catalogInfo.metadata.description = packageJson.description;

  const { editUrl, projectSlug, packageUrl } = generateUrls(
    packageJson.repository,
    packageJson.subPath,
  );

  catalogInfo.metadata.annotations['package/version'] = packageJson.version;
  catalogInfo.metadata.annotations['backstage.io/edit-url'] = editUrl;
  catalogInfo.metadata.annotations[
    `${isGithub ? 'github' : 'gitlab'}.com/project-slug`
  ] = projectSlug;

  catalogInfo.metadata.links.push({
    url: packageUrl,
    title: 'Documentation',
    icon: 'docs',
    type: 'documentation',
  });

  catalogInfo.metadata.tags = packageJson.keywords ?? [];
  catalogInfo.spec.owner = `group:${packageJson.owner}`;

  return catalogInfo;
}
