import type { Story, StoryDefault } from '@ladle/react';
import { Collection, DialogTrigger } from 'react-aria-components';
import { actions } from '../../ladle';
import {
  AriaHeader,
  AriaKeyboard,
  AriaSection,
  AriaSeparator,
  AriaText,
} from '../aria';
import { Button } from '../button';
import { Icon } from '../icon';
import { Options, OptionsItem, OptionsList } from './options';
import type { OptionsListProps } from './types';

type StoryProps = OptionsListProps<object>;

export default {
  title: 'Components',
  argTypes: {
    selectionBehavior: {
      control: {
        type: 'select',
      },
      options: ['toggle', 'replace'],
      defaultValue: 'toggle',
    },
    selectionMode: {
      control: {
        type: 'select',
      },
      options: ['none', 'single', 'multiple'],
      defaultValue: 'single',
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
      defaultValue: 'lg',
    },
  },
} satisfies StoryDefault;

export const Example1: Story<StoryProps> = (props) => {
  const options = [
    { id: 2, name: 'Koala', description: 'drunk bear' },
    { id: 3, name: 'Kangaroo', description: 'kicky jumpah' },
    { id: 4, name: 'Platypus', description: 'poison fur-duck' },
    { id: 6, name: 'Bald Eagle', description: 'tuxedo vulture' },
    { id: 7, name: 'Bison', description: 'stabby fur-cow' },
    { id: 8, name: 'Skunk', description: 'stinky squirrel' },
  ];

  return (
    <OptionsList
      {...props}
      {...actions<OptionsListProps<object>>('onSelectionChange')}
      aria-label='Pick an animal'
      items={options}
    >
      {(item) => (
        <OptionsItem {...item} textValue={item.name}>
          <AriaText slot='label'>{item.name}</AriaText>
          <AriaText slot='description'>{item.description}</AriaText>
        </OptionsItem>
      )}
    </OptionsList>
  );
};

Example1.storyName = 'Options / Flat';

export const Example2: Story<StoryProps> = (props) => {
  const options = [
    {
      id: 'foo',
      name: 'Australian',
      children: [
        { id: 2, name: 'Koala', description: 'drunk bear' },
        { id: 3, name: 'Kangaroo', description: 'kicky jumpah' },
        { id: 4, name: 'Platypus', description: 'poison fur-duck' },
        { id: 999 },
      ],
    },
    {
      id: 'bar',
      name: 'American',
      children: [
        { id: 6, name: 'Bald Eagle', description: 'tuxedo vulture' },
        { id: 7, name: 'Bison', description: 'stabby fur-cow' },
        { id: 8, name: 'Skunk', description: 'stinky squirrel' },
      ],
    },
    { id: 10, name: 'Foo' },
    { id: 666 },
    { id: 11, name: 'Bar' },
  ];

  return (
    <DialogTrigger>
      <Button>Click to see Options</Button>
      <Options>
        <OptionsList
          {...props}
          {...actions<OptionsListProps<object>>('onSelectionChange')}
          aria-label='Pick an animal'
          items={options}
        >
          {(section) => {
            const floatingItems = section.name ? (
              <OptionsItem {...section} textValue={section.name}>
                <Icon size='md'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                    <title>Ladle</title>
                    <path d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z' />
                  </svg>
                </Icon>
                <AriaText slot='label'>{section.name}</AriaText>
                <AriaKeyboard>⌘V</AriaKeyboard>
              </OptionsItem>
            ) : (
              <AriaSeparator />
            );

            return section.children ? (
              <AriaSection>
                <AriaHeader>{section.name}</AriaHeader>
                <Collection items={section.children}>
                  {(item) =>
                    item.name ? (
                      <OptionsItem {...item} textValue={item.name}>
                        <AriaText slot='label'>{item.name}</AriaText>
                        <AriaText slot='description'>
                          {item.description}
                        </AriaText>
                      </OptionsItem>
                    ) : (
                      <AriaSeparator />
                    )
                  }
                </Collection>
              </AriaSection>
            ) : (
              floatingItems
            );
          }}
        </OptionsList>
      </Options>
    </DialogTrigger>
  );
};

Example2.storyName = 'Options / Mixed';

export const Example3: Story<StoryProps> = (props) => {
  const options = [
    {
      id: 'foo',
      name: 'Australian',
      children: [
        { id: 2, name: 'Koala' },
        { id: 3, name: 'Kangaroo' },
        { id: 4, name: 'Platypus' },
      ],
    },
    {
      id: 'bar',
      name: 'American',
      children: [
        { id: 6, name: 'Bald Eagle' },
        { id: 7, name: 'Bison' },
        { id: 8, name: 'Skunk' },
      ],
    },
  ];

  return (
    <DialogTrigger>
      <Button>Click to see Options</Button>
      <Options>
        <OptionsList
          {...props}
          {...actions<OptionsListProps<object>>('onSelectionChange')}
          aria-label='Pick an animal'
          items={options}
        >
          {(section) => (
            <AriaSection>
              <AriaHeader>{section.name}</AriaHeader>
              <Collection items={section.children}>
                {(item) => (
                  <OptionsItem {...item} textValue={item.name}>
                    <AriaText slot='label'>{item.name}</AriaText>
                  </OptionsItem>
                )}
              </Collection>
            </AriaSection>
          )}
        </OptionsList>
      </Options>
    </DialogTrigger>
  );
};

Example3.storyName = 'Options / Sections';

export const Example4: Story<StoryProps> = (props) => (
  <DialogTrigger>
    <Button>Click to see Options</Button>
    <Options>
      <OptionsList
        {...props}
        {...actions<OptionsListProps<object>>('onSelectionChange')}
        aria-label='Pick an animal'
      >
        <AriaSection>
          <AriaHeader>Australian</AriaHeader>
          <OptionsItem>Koala</OptionsItem>
          <OptionsItem>Kangaroo</OptionsItem>
          <OptionsItem>Platypus</OptionsItem>
          <AriaSeparator />
        </AriaSection>
        <AriaSection>
          <AriaHeader>American</AriaHeader>
          <OptionsItem>Bald Eagle</OptionsItem>
          <OptionsItem>Bison</OptionsItem>
          <OptionsItem>Skunk</OptionsItem>
          <AriaSeparator />
        </AriaSection>
        <OptionsItem isDisabled>Foo</OptionsItem>
        <OptionsItem>Bar</OptionsItem>
      </OptionsList>
    </Options>
  </DialogTrigger>
);

Example4.storyName = 'Options / Static';
