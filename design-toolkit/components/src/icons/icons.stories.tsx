import type { Meta, StoryObj } from '@storybook/react';
import { startCase } from 'lodash';
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
import { default as catalog } from './catalog';

const meta: Meta = {
  title: 'Icons',
};

export default meta;
type Story = StoryObj;

export const UIIcons: Story = {
  render: () => {
    return (
      <div className='flex flex-col gap-xl'>
        {Object.entries(catalog).map(([section, meta]) => (
          <div key={section} className='flex flex-col gap-xl'>
            <h1 className='fg-interactive-default text-header-xl'>
              {startCase(section)}
            </h1>
            <p className='fg-interactive-hover-light text-body-s'>
              {meta.description}
            </p>
            <div className='fg-interactive-default grid auto-cols-max grid-cols-2 justify-center gap-l font-display text-body-xs md:grid-cols-4'>
              {meta.icons.map((icon) => {
                return (
                  <div className='flex items-center gap-l' key={icon.name}>
                    <span>{icon.icon}</span>
                    <span key={icon.name}>
                      {startCase(icon.name).replaceAll(' ', '')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
