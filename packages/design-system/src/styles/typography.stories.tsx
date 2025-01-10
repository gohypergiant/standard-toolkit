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

import type { StoryObj, Meta } from '@storybook/react';
import { headings, bodies } from './typography.css';

const meta: Meta = {
  title: 'Typography',
};

export default meta;

export const Headings: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {Object.entries(headings).map(([key, value]) => (
        <div key={key} className={value} title={`headings.${key}`}>
          Heading {key}
        </div>
      ))}
    </div>
  ),
};

export const Bodies: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {Object.entries(bodies).map(([key, value]) => (
        <div key={key} className={value} title={`bodies.${key}`}>
          Body {key}
        </div>
      ))}
    </div>
  ),
};
