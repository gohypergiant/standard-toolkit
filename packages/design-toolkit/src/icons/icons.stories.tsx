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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { title } from 'radashi';
import { useState } from 'react';
import { Icon } from '../components/icon';
import { SearchField } from '../components/search-field';
import { default as catalog } from './catalog';

const formatInput = (input: string) => {
  return input.toLocaleLowerCase().split(' ').join('-');
};

const meta = {
  title: 'Foundation/Icons',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const UIIcons: Story = {
  render: () => {
    const [filteredCatalog, setFilteredCatalog] = useState(
      Object.entries(catalog),
    );

    const handleSearch = (input: string) => {
      if (!input) {
        handleClear();
        return;
      }

      const searchTerm = formatInput(input);
      setFilteredCatalog(() => {
        return Object.entries(catalog).map(([header, items]) => {
          return [
            header,
            {
              ...items,
              icons: items.icons.filter((icon) =>
                icon.name.includes(searchTerm),
              ),
            },
          ];
        });
      });
    };

    const handleClear = () => {
      setFilteredCatalog(Object.entries(catalog));
    };

    return (
      <>
        <SearchField onChange={handleSearch} onClear={handleClear} />
        {filteredCatalog.map(([section, meta]) => (
          <div key={section} className='flex w-full flex-col gap-xl'>
            <h1 className='fg-primary-bold mt-xl text-header-xl'>
              {title(section)}
            </h1>
            <p className='fg-primary-muted text-body-s'>{meta.description}</p>
            <div className='fg-primary-bold grid auto-cols-max grid-cols-2 justify-center gap-l font-display text-body-xs md:grid-cols-3 lg:grid-cols-4'>
              {meta.icons.map((icon) => {
                return (
                  <div className='flex items-center gap-s' key={icon.name}>
                    <Icon className='fg-primary-bold flex-none'>
                      {icon.icon}
                    </Icon>
                    <div className='flex flex-col'>
                      <span className='flex-none'>
                        {title(icon.name).replaceAll(' ', '')}
                      </span>
                      <span className='fg-info-bold'>{icon.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </>
    );
  },
};
