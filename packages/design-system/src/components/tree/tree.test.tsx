import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AriaText } from '../aria';
import { Button, ToggleButton } from '../button';
import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
import { Tree, TreeGroup } from './tree';
import { type TreeProps, type TreeRenderProps } from './types';

function Node() {
  return (
    <>
      <ToggleButton slot='visibility'>
        {({ isSelected }) =>
          isSelected ? (
            <Icon fill='none' stroke='currentcolor'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                strokeWidth='1'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' />
                <circle cx='12' cy='12' r='3' />
              </svg>
            </Icon>
          ) : (
            <Icon fill='none' stroke='currentcolor'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                strokeWidth='1'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49' />
                <path d='M14.084 14.158a3 3 0 0 1-4.242-4.242' />
                <path d='M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143' />
                <path d='m2 2 20 20' />
              </svg>
            </Icon>
          )
        }
      </ToggleButton>
      <ToggleButton slot='expansion'>
        {({ isSelected }) =>
          isSelected ? (
            <Icon fill='none' stroke='currentcolor'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                strokeWidth='1'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='m6 9 6 6 6-6' />
              </svg>
            </Icon>
          ) : (
            <Icon fill='none' stroke='currentcolor'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                strokeWidth='1'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='m9 18 6-6-6-6' />
              </svg>
            </Icon>
          )
        }
      </ToggleButton>
      <AriaText slot='description' />
      <Checkbox slot='selection'>
        {({ isSelected }) =>
          isSelected ? (
            <Icon fill='none' stroke='currentColor'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                strokeWidth='1'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M20 6 9 17l-5-5' />
              </svg>
            </Icon>
          ) : null
        }
      </Checkbox>
      <Button slot='drag'>
        <Icon fill='none' stroke='currentcolor'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            strokeWidth='1'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='9' cy='12' r='1' />
            <circle cx='9' cy='5' r='1' />
            <circle cx='9' cy='19' r='1' />
            <circle cx='15' cy='12' r='1' />
            <circle cx='15' cy='5' r='1' />
            <circle cx='15' cy='19' r='1' />
          </svg>
        </Icon>
      </Button>
    </>
  );
}

function setup({
  nodes = [
    {
      id: 'foo',
      label: 'Foo',
    },
    {
      id: 'bar',
      label: 'Bar',
    },
  ],
  ...rest
}: Partial<Omit<TreeProps<unknown>, 'children'>> = {}) {
  render(
    rest.provider ? (
      <Tree {...rest} provider nodes={nodes}>
        {({ treeGroupProps }: TreeRenderProps<unknown>) => (
          <TreeGroup {...treeGroupProps}>
            <Node />
          </TreeGroup>
        )}
      </Tree>
    ) : (
      <Tree {...rest} provider={false} nodes={nodes}>
        <Node />
      </Tree>
    ),
  );

  return {
    ...rest,
    nodes,
  };
}

describe('Tree', () => {
  it('should render', () => {
    setup();

    expect(screen.getByText('Foo')).toBeInTheDocument();
  });
});
