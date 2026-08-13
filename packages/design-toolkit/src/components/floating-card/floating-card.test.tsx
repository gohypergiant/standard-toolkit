/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FloatingCard } from '.';
import { useFloatingCard } from './context';
import { FloatingCardProvider } from './provider';
import type { UniqueId } from '@accelint/core/utility/uuid';
import type { ReactNode } from 'react';
import type { FloatingCardProviderProps } from './types';

// Icon and Button reach for `client-only`, which jsdom cannot resolve. Minimal
// HTML stand-ins keep the accessible names these tests query by.
vi.mock('@accelint/design-toolkit/components/icon', () => ({
  Icon: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

vi.mock('@accelint/icons/cancel', () => ({
  default: () => <svg role='presentation' />,
}));

vi.mock('@accelint/icons/pin', () => ({
  default: () => <svg role='presentation' />,
}));

const cardId = 'card-a' as UniqueId;
const otherId = 'card-b' as UniqueId;

function renderProvider(
  children: ReactNode,
  props: Partial<FloatingCardProviderProps> = {},
) {
  return render(
    <FloatingCardProvider {...props}>{children}</FloatingCardProvider>,
  );
}

describe('FloatingCard', () => {
  it('should render its children inside a card labelled by the title', () => {
    renderProvider(
      <FloatingCard id={cardId} title='Details'>
        <p>Panel body</p>
      </FloatingCard>,
    );

    const card = screen.getByRole('dialog', { name: 'Details' });

    expect(card).toBeInTheDocument();
    expect(screen.getByText('Panel body')).toBeInTheDocument();
  });

  it('should fall back to the id when no title is given', () => {
    renderProvider(
      <FloatingCard id={cardId}>
        <p>Panel body</p>
      </FloatingCard>,
    );

    expect(screen.getByRole('dialog', { name: cardId })).toBeInTheDocument();
  });

  it('should update the accessible name when the title changes', () => {
    const { rerender } = renderProvider(
      <FloatingCard id={cardId} title='Before'>
        <p>Panel body</p>
      </FloatingCard>,
    );

    expect(screen.getByRole('dialog', { name: 'Before' })).toBeInTheDocument();

    rerender(
      <FloatingCardProvider>
        <FloatingCard id={cardId} title='After'>
          <p>Panel body</p>
        </FloatingCard>
      </FloatingCardProvider>,
    );

    expect(screen.getByRole('dialog', { name: 'After' })).toBeInTheDocument();
  });

  it('should render nothing when isOpen is false', () => {
    renderProvider(
      <FloatingCard id={cardId} title='Details' isOpen={false}>
        <p>Panel body</p>
      </FloatingCard>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Panel body')).not.toBeInTheDocument();
  });

  it('should render each open card exactly once', () => {
    renderProvider(
      <>
        <FloatingCard id={cardId} title='Card A'>
          <p>Body A</p>
        </FloatingCard>
        <FloatingCard id={otherId} title='Card B'>
          <p>Body B</p>
        </FloatingCard>
      </>,
    );

    expect(screen.getAllByRole('dialog')).toHaveLength(2);
    expect(screen.getByRole('dialog', { name: 'Card A' })).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Card B' })).toBeInTheDocument();
  });

  it('should apply initialDimensions and initialPosition to the card', () => {
    renderProvider(
      <FloatingCard
        id={cardId}
        title='Sized'
        initialDimensions={{ width: 250, height: 200 }}
        initialPosition={{ x: 40, y: 60 }}
      >
        <p>Panel body</p>
      </FloatingCard>,
    );

    const card = screen.getByRole('dialog', { name: 'Sized' });

    expect(card).toHaveStyle({
      width: '250px',
      height: '200px',
      left: '40px',
      top: '60px',
    });
  });

  it('should fall back to default geometry when none is given', () => {
    renderProvider(
      <FloatingCard id={cardId} title='Default'>
        <p>Panel body</p>
      </FloatingCard>,
    );

    expect(screen.getByRole('dialog', { name: 'Default' })).toHaveStyle({
      width: '300px',
      height: '400px',
    });
  });

  it('should remove the card when it unmounts', async () => {
    const user = userEvent.setup();

    function Toggle() {
      const [mounted, setMounted] = useState(true);

      return (
        <FloatingCardProvider>
          <button onClick={() => setMounted(false)} type='button'>
            unmount
          </button>
          {mounted ? (
            <FloatingCard id={cardId} title='Details'>
              <p>Panel body</p>
            </FloatingCard>
          ) : null}
        </FloatingCardProvider>
      );
    }

    render(<Toggle />);

    expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'unmount' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('FloatingCard controlled visibility', () => {
  function Controlled() {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <FloatingCardProvider>
        <button onClick={() => setIsOpen((open) => !open)} type='button'>
          toggle
        </button>
        <FloatingCard id={cardId} title='Details' isOpen={isOpen}>
          <p>Panel body</p>
        </FloatingCard>
      </FloatingCardProvider>
    );
  }

  it('should close and reopen the card as isOpen changes', async () => {
    const user = userEvent.setup();

    render(<Controlled />);

    expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'toggle' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'toggle' }));

    expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();
  });
});

describe('FloatingCardProvider header', () => {
  it('should render a close button that removes the card', async () => {
    const user = userEvent.setup();

    renderProvider(
      <FloatingCard id={cardId} title='Details'>
        <p>Panel body</p>
      </FloatingCard>,
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render custom header actions and call their handlers', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderProvider(
      <FloatingCard id={cardId} title='Details'>
        <p>Panel body</p>
      </FloatingCard>,
      { headerActions: [{ icon: <span>settings</span>, onClick }] },
    );

    const actions = screen.getAllByRole('button');

    // The action sits before the always-present close button.
    await user.click(actions[0] as HTMLElement);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('should resolve headerActions per card when given a factory', () => {
    renderProvider(
      <>
        <FloatingCard id={cardId} title='Card A'>
          <p>Body A</p>
        </FloatingCard>
        <FloatingCard id={otherId} title='Card B'>
          <p>Body B</p>
        </FloatingCard>
      </>,
      { headerActions: (id) => (id === cardId ? ['pin'] : []) },
    );

    const cardA = screen.getByRole('dialog', { name: 'Card A' });
    const cardB = screen.getByRole('dialog', { name: 'Card B' });

    expect(
      within(cardA).getByRole('button', { name: 'Pin' }),
    ).toBeInTheDocument();
    expect(
      within(cardB).queryByRole('button', { name: 'Pin' }),
    ).not.toBeInTheDocument();
  });

  it('should render a divider between action groups', () => {
    renderProvider(
      <FloatingCard id={cardId} title='Details'>
        <p>Panel body</p>
      </FloatingCard>,
      {
        headerActions: [
          { icon: <span>one</span>, onClick: vi.fn() },
          'divider',
          { icon: <span>two</span>, onClick: vi.fn() },
        ],
      },
    );

    // Two custom actions plus the close button.
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('should render an icon resolved per card when given a factory', () => {
    renderProvider(
      <>
        <FloatingCard id={cardId} title='Card A'>
          <p>Body A</p>
        </FloatingCard>
        <FloatingCard id={otherId} title='Card B'>
          <p>Body B</p>
        </FloatingCard>
      </>,
      { icon: (id) => (id === cardId ? <span>star</span> : null) },
    );

    expect(
      within(screen.getByRole('dialog', { name: 'Card A' })).getByText('star'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('dialog', { name: 'Card B' })).queryByText(
        'star',
      ),
    ).not.toBeInTheDocument();
  });
});

describe('FloatingCard pinning', () => {
  const pinProps = { headerActions: ['pin' as const] };

  it('should toggle the pin button pressed state', async () => {
    const user = userEvent.setup();

    renderProvider(
      <FloatingCard id={cardId} title='Details'>
        <p>Panel body</p>
      </FloatingCard>,
      pinProps,
    );

    const pin = screen.getByRole('button', { name: 'Pin' });

    expect(pin).toHaveAttribute('aria-pressed', 'false');

    await user.click(pin);

    expect(pin).toHaveAttribute('aria-pressed', 'true');

    await user.click(pin);

    expect(pin).toHaveAttribute('aria-pressed', 'false');
  });

  it('should start pinned for ids listed in initialPinned', () => {
    renderProvider(
      <FloatingCard id={cardId} title='Details'>
        <p>Panel body</p>
      </FloatingCard>,
      { ...pinProps, initialPinned: [cardId] },
    );

    expect(screen.getByRole('button', { name: 'Pin' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('should pin only the card whose button was pressed', async () => {
    const user = userEvent.setup();

    renderProvider(
      <>
        <FloatingCard id={cardId} title='Card A'>
          <p>Body A</p>
        </FloatingCard>
        <FloatingCard id={otherId} title='Card B'>
          <p>Body B</p>
        </FloatingCard>
      </>,
      pinProps,
    );

    const cardA = screen.getByRole('dialog', { name: 'Card A' });
    const cardB = screen.getByRole('dialog', { name: 'Card B' });

    await user.click(within(cardA).getByRole('button', { name: 'Pin' }));

    expect(within(cardA).getByRole('button', { name: 'Pin' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(within(cardB).getByRole('button', { name: 'Pin' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('should release the pin when a pinned card is closed', async () => {
    const user = userEvent.setup();

    function Reopenable() {
      const [isOpen, setIsOpen] = useState(true);

      return (
        <FloatingCardProvider {...pinProps}>
          <button onClick={() => setIsOpen((open) => !open)} type='button'>
            toggle
          </button>
          <FloatingCard id={cardId} title='Details' isOpen={isOpen}>
            <p>Panel body</p>
          </FloatingCard>
        </FloatingCardProvider>
      );
    }

    render(<Reopenable />);

    await user.click(screen.getByRole('button', { name: 'Pin' }));
    await user.click(screen.getByRole('button', { name: 'toggle' }));
    await user.click(screen.getByRole('button', { name: 'toggle' }));

    expect(screen.getByRole('button', { name: 'Pin' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});

describe('useFloatingCard', () => {
  it('should throw when used outside a provider', () => {
    function Orphan() {
      useFloatingCard();
      return null;
    }

    // React logs the error boundary trace; silence it for this expected throw.
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    expect(() => render(<Orphan />)).toThrow(
      'useFloatingCard must be used within a FloatingCardProvider.',
    );

    consoleError.mockRestore();
  });

  it('should close a card through closeCard', async () => {
    const user = userEvent.setup();

    function Closer() {
      const { closeCard } = useFloatingCard();

      return (
        <button onClick={() => closeCard(cardId)} type='button'>
          close card
        </button>
      );
    }

    renderProvider(
      <>
        <Closer />
        <FloatingCard id={cardId} title='Details'>
          <p>Panel body</p>
        </FloatingCard>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'close card' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should report and toggle pin state through the context', async () => {
    const user = userEvent.setup();

    function PinReporter() {
      const { togglePinCard, isPinned, subscribeToPinState } =
        useFloatingCard();
      const [, force] = useState(0);

      // Re-render on pin changes so the label below stays current.
      useState(() => subscribeToPinState(() => force((n) => n + 1)));

      return (
        <button onClick={() => togglePinCard(cardId)} type='button'>
          {isPinned(cardId) ? 'pinned' : 'not pinned'}
        </button>
      );
    }

    renderProvider(
      <>
        <PinReporter />
        <FloatingCard id={cardId} title='Details'>
          <p>Panel body</p>
        </FloatingCard>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'not pinned' }));

    expect(screen.getByRole('button', { name: 'pinned' })).toBeInTheDocument();
  });

  it('should expose the portal container for an open card', () => {
    const seen: Record<string, HTMLElement>[] = [];

    function CardsReporter() {
      const { cards } = useFloatingCard();
      seen.push(cards);
      return null;
    }

    renderProvider(
      <>
        <CardsReporter />
        <FloatingCard id={cardId} title='Details'>
          <p>Panel body</p>
        </FloatingCard>
      </>,
    );

    const latest = seen.at(-1);

    expect(latest?.[cardId]).toBeInstanceOf(HTMLElement);
  });
});

describe('multiple FloatingCardProvider instances', () => {
  it('should keep each provider independent', async () => {
    const user = userEvent.setup();

    render(
      <>
        <FloatingCardProvider>
          <FloatingCard id={cardId} title='First'>
            <p>Body A</p>
          </FloatingCard>
        </FloatingCardProvider>
        <FloatingCardProvider>
          <FloatingCard id={otherId} title='Second'>
            <p>Body B</p>
          </FloatingCard>
        </FloatingCardProvider>
      </>,
    );

    expect(screen.getAllByRole('dialog')).toHaveLength(2);

    const first = screen.getByRole('dialog', { name: 'First' });

    await user.click(within(first).getByRole('button', { name: 'Close' }));

    expect(
      screen.queryByRole('dialog', { name: 'First' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Second' })).toBeInTheDocument();
  });
});
