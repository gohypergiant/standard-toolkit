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

import { type Story, type StoryDefault, action } from '@ladle/react';
import type { CSSProperties } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from './tabs';
import type { TabListProps } from './types';

export default {
  title: 'Components/Tabs',
  argTypes: {
    align: {
      control: {
        type: 'select',
      },
      options: ['start', 'middle', 'end'],
    },
    anchor: {
      control: {
        type: 'select',
      },
      options: ['start', 'end'],
      defaultValue: 'end',
    },
    orientation: {
      control: {
        type: 'select',
      },
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
      defaultValue: 'lg',
    },
    variant: {
      control: {
        type: 'select',
      },
      options: ['border', 'fill'],
      defaultValue: 'border',
    },
  },
} satisfies StoryDefault<TabListProps<object>>;

/**
 * In this example, all tabs are always rendered (due to shouldForceMount on TabPanels),
 * but inert tabs are visually hidden. This may be desirable in areas where simple content
 * is rendered and the space of the largest content is maintained to avoid shifts in layout.
 *
 * Not recommended for use where complex content should be unmounted to free up resources
 *
 * This is also unnecessary if the content area has a set height
 */
export const StackedExample: Story<TabListProps<object>> = (props) => {
  const axis = props.orientation === 'vertical' ? 'row' : 'column';
  const direction: CSSProperties['flexDirection'] = `${axis}${props.anchor === 'start' ? '-reverse' : ''}`;

  return (
    <Tabs onSelectionChange={action('onSelectionChange')}>
      <div style={{ display: 'flex', flexDirection: direction }}>
        <TabList {...props}>
          <Tab id='a'>Hello</Tab>
          <Tab id='b'>Foo</Tab>
          <Tab id='c'>Lorem</Tab>
        </TabList>
        <TabPanels shouldForceMount>
          <TabPanel id='a'>World</TabPanel>
          <TabPanel id='b'>Bar</TabPanel>
          <TabPanel id='c'>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              risus sapien, iaculis ac venenatis vel, volutpat eu tellus. Sed
              vitae accumsan elit. Maecenas egestas porttitor felis, non auctor
              tortor consequat ut. Etiam at nibh eget ante suscipit varius et
              quis diam. Nullam a tortor urna. Donec vitae risus et lorem
              pellentesque varius. Duis vulputate neque est, nec gravida erat
              efficitur sit amet. Sed efficitur tincidunt erat.
            </p>
            <p>
              Nulla feugiat ut sem vitae maximus. Mauris blandit arcu tempor
              porta sagittis. Cras tincidunt at turpis ac tempor. In nulla
              tortor, egestas id arcu ac, venenatis tempor urna. Integer a lorem
              vehicula, pulvinar massa in, placerat nunc. Quisque sed
              consectetur justo, ut malesuada enim. Vivamus imperdiet dignissim
              eros ac ultricies. Sed laoreet suscipit justo sit amet tincidunt.
            </p>
          </TabPanel>
        </TabPanels>
      </div>
      <p>
        NOTE: This content shouldn&apos;t move because the content stack will
        remain the height of the largest content
      </p>
    </Tabs>
  );
};

StackedExample.storyName = 'Stacked';

export const SoloExample: Story<TabListProps<object>> = (props) => {
  const axis = props.orientation === 'vertical' ? 'row' : 'column';
  const direction: CSSProperties['flexDirection'] = `${axis}${props.anchor === 'start' ? '-reverse' : ''}`;

  return (
    <Tabs onSelectionChange={action('onSelectionChange')}>
      <div style={{ display: 'flex', flexDirection: direction }}>
        <TabList {...props}>
          <Tab id='a'>Hello</Tab>
          <Tab id='b'>Foo</Tab>
          <Tab id='c'>Lorem</Tab>
        </TabList>
        <TabPanels>
          <TabPanel id='a'>World</TabPanel>
          <TabPanel id='b'>Bar</TabPanel>
          <TabPanel id='c'>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              risus sapien, iaculis ac venenatis vel, volutpat eu tellus. Sed
              vitae accumsan elit. Maecenas egestas porttitor felis, non auctor
              tortor consequat ut. Etiam at nibh eget ante suscipit varius et
              quis diam. Nullam a tortor urna. Donec vitae risus et lorem
              pellentesque varius. Duis vulputate neque est, nec gravida erat
              efficitur sit amet. Sed efficitur tincidunt erat.
            </p>
            <p>
              Nulla feugiat ut sem vitae maximus. Mauris blandit arcu tempor
              porta sagittis. Cras tincidunt at turpis ac tempor. In nulla
              tortor, egestas id arcu ac, venenatis tempor urna. Integer a lorem
              vehicula, pulvinar massa in, placerat nunc. Quisque sed
              consectetur justo, ut malesuada enim. Vivamus imperdiet dignissim
              eros ac ultricies. Sed laoreet suscipit justo sit amet tincidunt.
            </p>
          </TabPanel>
        </TabPanels>
      </div>
      <p>
        NOTE: This content should move because the lack of a content stack will
        cause content below it to shift up/down based on the rendered tab
      </p>
    </Tabs>
  );
};

SoloExample.storyName = 'Solo';
