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

type CatalogInfoLink = {
  url: string;
  title: string;
  icon: string;
  type: string;
};

type CatalogInfoAnnotations = {
  'backstage.io/edit-url': string;
  'backstage.io/techdocs-ref': string;
  'package/version': string;
  'gitlab.com/project-slug'?: string;
  'github.com/project-slug'?: string;
};

type CatalogInfoSpec = {
  type: 'serivce' | 'website' | 'library';
  lifecycle: 'experimental' | 'production' | 'deprecated';
  owner: string;
  subcomponentOf?: string;
  dependsOn?: string[];
};

export type CatalogInfo = {
  apiVersion: 'backstage.io/v1alpha1';
  kind: 'Component';
  metadata: {
    name: string;
    title: string;
    description: string;
    annotations: CatalogInfoAnnotations;
    links: CatalogInfoLink[];
    tags: string[];
  };
  spec: CatalogInfoSpec;
};

export const template: CatalogInfo = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: '<name>',
    title: '<title>',
    description: '<description>\n',
    annotations: {
      'backstage.io/edit-url': '<catalog-info-edit-url>',
      'backstage.io/techdocs-ref': 'dir:.',
      'package/version': '*',
    },
    links: [],
    tags: [],
  },
  spec: {
    type: 'library',
    lifecycle: 'production',
    owner: 'group:<owner>',
  },
};
