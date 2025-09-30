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

import { Clock } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Clock> = {
  title: 'Components/Clock',
  component: Clock,
  args: {
    className: undefined,
    formatter: undefined,
  },
  argTypes: {
    className: {
      control: 'text',
    },
    formatter: {
      control: 'object',
      description:
        '<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat">MDN Reference</a>',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Clock> = {
  render: Clock,
};

export const Styling: StoryObj<typeof Clock> = {
  render: () => <Clock className='fg-accent-primary-bold' />,
};

const customFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'short',
  timeStyle: 'long',
  timeZone: 'UTC',
  hour12: false,
});

export const CustomFormat: StoryObj<typeof Clock> = {
  render: ({ ...rest }) => <Clock {...rest} formatter={customFormatter} />,
};
