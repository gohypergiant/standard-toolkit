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

import { uuid } from '@accelint/core';
import { BaseMap as BaseMapComponent } from '../base-map';
import { ViewportsToolbar } from './viewports-toolbar';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'DeckGL/Saved Viewports',
};

export default meta;
type Story = StoryObj<typeof meta>;
const SAVED_VIEWPORTS_STORY_ID = uuid();

export const SavedViewports: Story = {
  render: () => {
    return (
      <>
        <ViewportsToolbar />
        <BaseMapComponent
          className='h-dvh w-dvw'
          id={SAVED_VIEWPORTS_STORY_ID}
        />
      </>
    );
  },
};
