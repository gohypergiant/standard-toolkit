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

import { useEffect, useMemo } from 'react';
import { BaseMap } from '../base-map';
import { FormatTypes, useHoverCoordinate } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Cursor LatLng',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    format: {
      options: Object.keys(FormatTypes),
      mapping: FormatTypes,
      control: {
        type: 'select',
        labels: {
          // 'labels' maps option values to string labels
          Dd: 'dd',
          Ddm: 'ddm',
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

type Props = {
  format: FormatTypes;
};

const FormattedCoord = (props: Props) => {
  const { formattedCoord, setFormat } = useHoverCoordinate();
  useEffect(() => {
    setFormat(props.format);
  }, [props.format]);

  return (
    <div
      className='size-[400px]'
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        color: 'white',
        height: 'auto',
      }}
    >
      {formattedCoord}
    </div>
  );
};

export const Default: Story = {
  args: {
    format: 'Dd',
  },

  render: (args) => {
    return (
      <div>
        <BaseMap className='h-dvh w-dvw' />
        <FormattedCoord {...(args as Props)} />
      </div>
    );
  },
};
