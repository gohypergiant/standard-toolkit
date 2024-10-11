import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AriaHeading } from '../aria';
import { Element } from '../element';
import { Dialog } from './dialog';
import type { DialogProps } from './types';

function setup({
  children = 'Foo',
  isOpen = true,
  ...rest
}: Partial<DialogProps> = {}) {
  render(
    <Dialog {...rest} isOpen={isOpen}>
      {children}
    </Dialog>,
  );

  return {
    ...rest,
    children,
    isOpen,
  };
}

describe('Dialog', () => {
  it('should render', () => {
    const title = 'Hello';
    const content = 'World';
    const footer = 'Foobar';

    setup({
      children: (
        <>
          <Element slot='header'>
            <AriaHeading slot='title'>{title}</AriaHeading>
          </Element>
          <Element slot='content'>{content}</Element>
          <Element slot='footer'>{footer}</Element>
        </>
      ),
    });

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(content)).toBeInTheDocument();
    expect(screen.getByText(footer)).toBeInTheDocument();
  });
});
