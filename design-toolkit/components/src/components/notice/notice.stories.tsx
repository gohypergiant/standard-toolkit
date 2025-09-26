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

import { useOn } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { Notice } from './';
import { NoticeEventTypes } from './events';
import type { Meta, StoryObj } from '@storybook/react';
import type { NoticePressEvent } from './types';

const meta: Meta<typeof Notice> = {
  title: 'Components/Notice',
  component: Notice,
  args: {
    color: 'info',
    message:
      'This is a flexible snackbar that can be either a single or double line that will wrap accordingly when it gets too long for a single line.',
    size: 'medium',
    showClose: true,
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['info', 'advisory', 'normal', 'serious', 'critical'],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Notice> = {
  render: ({ ...rest }) => {
    return <Notice {...rest} />;
  },
};

export const ButtonEvents: StoryObj<typeof Notice> = {
  render: (args) => {
    const closeId = uuid();
    const actionId = uuid();

    useOn(NoticeEventTypes.close, (data: NoticePressEvent) => {
      alert(`${data.payload.id} closed`);
    });

    useOn(NoticeEventTypes.primaryOnPress, (data: NoticePressEvent) => {
      alert(`${data.payload.id} primary pressed`);
    });

    useOn(NoticeEventTypes.secondaryOnPress, (data: NoticePressEvent) => {
      alert(`${data.payload.id} secondary pressed`);
    });

    return (
      <div className='flex flex-col gap-s'>
        <Notice {...args} id={closeId} />
        <Notice
          {...args}
          showClose={false}
          id={actionId}
          primary={{ children: 'Primary' }}
          secondary={{ children: 'Secondary' }}
        />
      </div>
    );
  },
};
