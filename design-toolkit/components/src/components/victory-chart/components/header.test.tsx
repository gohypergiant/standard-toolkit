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

import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChartContext } from '../lib/chart-context';
import { Header } from './header';

type Context = Parameters<typeof ChartContext.Provider>[0]['value'];

const FUZZ = Math.random().toString(36).slice(2);

const focus = `Focus for ${FUZZ}`;
const title = `Title for ${FUZZ}`;
const zoom = `Zoom for ${FUZZ}`;

describe('Header Component', () => {
  const defaultContext: Context = {
    gridTemplateRows: '',
    plugins: {
      detail: () => null,
      focus: ({ onUpdate }) => (
        <div>
          {/* @ts-ignore */}
          <input onChange={() => onUpdate()} />
          <span>{focus}</span>
        </div>
      ),
      noData: () => null,
      rulerDay: () => null,
      rulerHour: () => null,
      timing: () => null,
      title: () => <span>{title}</span>,
      zoom: ({ onUpdate }) => (
        <div>
          {/* @ts-ignore */}
          <input onChange={() => onUpdate()} />
          <span>{zoom}</span>
        </div>
      ),
    },
    rulerRows: ['', ''],
  };

  const renderWithContext = (
    { onUpdate, state }: Parameters<typeof Header>[0],
    context: Context = defaultContext,
  ) =>
    render(
      <ChartContext.Provider value={context}>
        <Header onUpdate={onUpdate} state={state} />
      </ChartContext.Provider>,
    );

  it('should render without crashing', () => {
    const { container, getByText } = renderWithContext({
      onUpdate: vi.fn(),
      state: {
        data: [],
        focus: 24,
        zoom: 100,
      },
    });

    expect(container).toBeTruthy();
    expect(getByText(focus)).toBeInTheDocument();
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(zoom)).toBeInTheDocument();
  });

  it('should call onUpdate when focus or zoom changes', () => {
    const onUpdate = vi.fn();
    const { getAllByRole } = renderWithContext({
      onUpdate,
      state: {
        data: [],
        focus: 24,
        zoom: 100,
      },
    });

    expect(onUpdate).not.toHaveBeenCalled();

    // Find all input elements (focus and zoom)
    const [focus, zoom] = getAllByRole('textbox');

    // Trigger change on focus input
    expect(focus).toBeTruthy();
    fireEvent.change(focus as HTMLElement, { target: { value: '48' } });
    expect(onUpdate).toHaveBeenCalledTimes(1);

    // Trigger change on zoom input
    expect(zoom).toBeTruthy();
    fireEvent.change(zoom as HTMLElement, { target: { value: '200' } });
    expect(onUpdate).toHaveBeenCalledTimes(2);
  });

  it('should render nothing', () => {
    const { container } = renderWithContext(
      {
        onUpdate: vi.fn(),
        state: {
          data: [],
          focus: 24,
          zoom: 100,
        },
      },
      {
        ...defaultContext,
        plugins: {
          ...defaultContext.plugins,
          focus: false,
          title: false,
          zoom: false,
        },
      },
    );

    expect(container).toBeEmptyDOMElement();
  });
});
