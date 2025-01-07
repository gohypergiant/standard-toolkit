import { render, screen } from '@testing-library/react';
import {
  Slider,
  SliderBar,
  SliderInput,
  SliderThumb,
  SliderTrack,
} from './slider';
import { describe, expect, it } from 'vitest';
import type { SliderProps } from './types';
import { AriaLabel, AriaText } from '../aria';
import { Input } from '../input';

function setup({
  children = (
    <>
      <AriaLabel>Foo</AriaLabel>
      <SliderInput>
        <Input />
      </SliderInput>
      <SliderTrack>
        <SliderBar />
        <SliderThumb />
      </SliderTrack>
      <AriaText slot='min'>0</AriaText>
      <AriaText slot='max'>100</AriaText>
    </>
  ),
  ...rest
}: Partial<SliderProps> = {}) {
  render(<Slider {...rest}>{children}</Slider>);

  return {
    ...rest,
    children,
  };
}

describe('Slider', () => {
  it('should render', () => {
    setup();

    const element = screen.getByRole('group');

    expect(element).toBeInTheDocument();
  });
});
