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

import { describe, expect, it } from 'vitest';
import { template } from '../../src/utils/catalog-info-template.js';

describe('catalog-info-template', () => {
  it('should have the correct structure', () => {
    // Check the structure of the template
    expect(template).toMatchObject({
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
    });
  });

  it('should have the correct apiVersion', () => {
    expect(template.apiVersion).toBe('backstage.io/v1alpha1');
  });

  it('should have the correct kind', () => {
    expect(template.kind).toBe('Component');
  });

  it('should have the correct spec defaults', () => {
    expect(template.spec.type).toBe('library');
    expect(template.spec.lifecycle).toBe('production');
  });

  it('should have placeholder metadata fields', () => {
    // Check metadata fields using toMatchObject for more reliable comparison
    expect(template.metadata).toMatchObject({
      name: '<name>',
      title: '<title>',
      description: '<description>\n',
      links: [],
      tags: [],
    });
  });

  it('should have placeholder annotations', () => {
    expect(template.metadata.annotations['backstage.io/edit-url']).toBe(
      '<catalog-info-edit-url>',
    );
    expect(template.metadata.annotations['backstage.io/techdocs-ref']).toBe(
      'dir:.',
    );
    expect(template.metadata.annotations['package/version']).toBe('*');
  });
});
