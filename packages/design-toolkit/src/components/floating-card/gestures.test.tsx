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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FloatingCard } from '.';
import { DRAG_THRESHOLD } from './constants';
import { FloatingCardProvider } from './provider';
import type { UniqueId } from '@accelint/core/utility/uuid';
import type { UserEvent } from '@testing-library/user-event';
import type { ReactNode } from 'react';
import type { FloatingCardProviderProps } from './types';

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

/**
 * Provider size the cards are constrained to during these tests. Kept inside
 * jsdom's 1024x768 window so the `bounds: 'viewport'` case has room to travel
 * past the provider's own edge, while still leaving space for the drag and
 * resize gestures below to move without clamping.
 */
const CONTAINER = { width: 800, height: 700 };

/**
 * jsdom gives every element a zero-sized rect, so the provider would report
 * empty bounds and clamp every gesture to the origin. Reporting a fixed size
 * lets the real clamping logic run.
 */
function stubProviderBounds() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: CONTAINER.width,
    bottom: CONTAINER.height,
    width: CONTAINER.width,
    height: CONTAINER.height,
    toJSON: () => ({}),
  });
}

/**
 * Presses on a target, moves to a new point, and releases.
 *
 * @remarks
 * The move and release are addressed to the document body because the hooks
 * listen there for the duration of a gesture, which is what lets a drag keep
 * tracking once the pointer leaves the element it started on.
 */
function drag(
  user: UserEvent,
  target: Element,
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  return user.pointer([
    { keys: '[MouseLeft>]', target, coords: from },
    { target: document.body, coords: to },
    { keys: '[/MouseLeft]', target: document.body, coords: to },
  ]);
}

function renderCard(props: Partial<FloatingCardProviderProps> = {}) {
  render(
    <FloatingCardProvider {...props}>
      <FloatingCard
        id={cardId}
        title='Details'
        initialDimensions={{ width: 300, height: 400 }}
        initialPosition={{ x: 100, y: 100 }}
      >
        <p>Panel body</p>
      </FloatingCard>
    </FloatingCardProvider>,
  );

  const card = screen.getByRole('dialog', { name: 'Details' });

  return {
    card,
    header: card.firstElementChild as HTMLElement,
    user: userEvent.setup(),
  };
}

function handleFor(card: HTMLElement, direction: string) {
  const handle = card.querySelector(`[data-handle="${direction}"]`);

  if (!handle) {
    throw new Error(`missing resize handle: ${direction}`);
  }

  return handle;
}

beforeEach(() => {
  stubProviderBounds();
});

describe('dragging a card', () => {
  it('should move the card by the pointer delta', async () => {
    const { card, header, user } = renderCard();

    await drag(user, header, { x: 150, y: 110 }, { x: 250, y: 210 });

    expect(card).toHaveStyle({ left: '200px', top: '200px' });
  });

  it('should ignore movement below the drag threshold', async () => {
    const { card, header, user } = renderCard();

    await drag(
      user,
      header,
      { x: 150, y: 110 },
      { x: 150 + DRAG_THRESHOLD - 1, y: 110 },
    );

    expect(card).toHaveStyle({ left: '100px', top: '100px' });
  });

  it('should keep the card inside the container', async () => {
    const { card, header, user } = renderCard();

    await drag(user, header, { x: 150, y: 110 }, { x: 5000, y: 5000 });

    // Clamped so the far edges rest on the container's edges.
    expect(card).toHaveStyle({
      left: `${CONTAINER.width - 300}px`,
      top: `${CONTAINER.height - 400}px`,
    });
  });

  it('should not move past the top-left corner', async () => {
    const { card, header, user } = renderCard();

    await drag(user, header, { x: 150, y: 110 }, { x: -5000, y: -5000 });

    expect(card).toHaveStyle({ left: '0px', top: '0px' });
  });

  it('should allow the card past the provider edge when bounds is viewport', async () => {
    const { card, header, user } = renderCard({ bounds: 'viewport' });

    await drag(user, header, { x: 150, y: 110 }, { x: 5000, y: 110 });

    // The provider is stubbed at the origin, so the viewport is the only limit
    // and it reaches further right than the provider's own edge.
    expect(card).toHaveStyle({
      left: `${window.innerWidth - 300}px`,
    });
    expect(Number.parseInt(card.style.left, 10)).toBeGreaterThan(
      CONTAINER.width - 300,
    );
  });

  it('should not drag when the press starts on a header button', async () => {
    const { card, user } = renderCard();
    const close = screen.getByRole('button', { name: 'Close' });

    await drag(user, close, { x: 150, y: 110 }, { x: 300, y: 300 });

    expect(card).toHaveStyle({ left: '100px', top: '100px' });
  });

  it('should not drag a pinned card', async () => {
    const { card, header, user } = renderCard({
      headerActions: ['pin'],
      initialPinned: [cardId],
    });

    await drag(user, header, { x: 150, y: 110 }, { x: 300, y: 300 });

    expect(card).toHaveStyle({ left: '100px', top: '100px' });
  });

  it('should ignore non-primary buttons', async () => {
    const { card, header, user } = renderCard();

    await user.pointer([
      { keys: '[MouseRight>]', target: header, coords: { x: 150, y: 110 } },
      { target: document.body, coords: { x: 400, y: 400 } },
      { keys: '[/MouseRight]', target: document.body },
    ]);

    expect(card).toHaveStyle({ left: '100px', top: '100px' });
  });
});

describe('resizing a card', () => {
  it('should grow from the south-east corner without moving the origin', async () => {
    const { card, user } = renderCard();

    await drag(
      user,
      handleFor(card, 'se'),
      { x: 400, y: 500 },
      { x: 500, y: 600 },
    );

    expect(card).toHaveStyle({
      width: '400px',
      height: '500px',
      left: '100px',
      top: '100px',
    });
  });

  it('should move the origin when resizing from the north-west corner', async () => {
    const { card, user } = renderCard();

    await drag(
      user,
      handleFor(card, 'nw'),
      { x: 100, y: 100 },
      { x: 150, y: 150 },
    );

    expect(card).toHaveStyle({
      width: '250px',
      height: '350px',
      left: '150px',
      top: '150px',
    });
  });

  it('should resize width only from an east handle', async () => {
    const { card, user } = renderCard();

    await drag(
      user,
      handleFor(card, 'e'),
      { x: 400, y: 300 },
      { x: 450, y: 380 },
    );

    expect(card).toHaveStyle({ width: '350px', height: '400px' });
  });

  it('should resize height only from a south handle', async () => {
    const { card, user } = renderCard();

    await drag(
      user,
      handleFor(card, 's'),
      { x: 250, y: 500 },
      { x: 330, y: 560 },
    );

    expect(card).toHaveStyle({ width: '300px', height: '460px' });
  });

  it('should stop at the minimum size', async () => {
    const { card, user } = renderCard();

    await drag(user, handleFor(card, 'se'), { x: 400, y: 500 }, { x: 0, y: 0 });

    expect(card).toHaveStyle({ width: '150px', height: '100px' });
  });

  it('should not resize beyond the container', async () => {
    const { card, user } = renderCard();

    await drag(
      user,
      handleFor(card, 'se'),
      { x: 400, y: 500 },
      { x: 5000, y: 5000 },
    );

    expect(card).toHaveStyle({
      width: `${CONTAINER.width - 100}px`,
      height: `${CONTAINER.height - 100}px`,
    });
  });

  it('should not render resize handles while pinned', () => {
    const { card } = renderCard({
      headerActions: ['pin'],
      initialPinned: [cardId],
    });

    expect(card.querySelectorAll('[data-handle]')).toHaveLength(0);
  });
});

describe('stacking order', () => {
  it('should raise a card above its siblings when pressed', async () => {
    const user = userEvent.setup();

    render(
      <FloatingCardProvider>
        <FloatingCard id={'first' as UniqueId} title='First'>
          <p>Body A</p>
        </FloatingCard>
        <FloatingCard id={'second' as UniqueId} title='Second'>
          <p>Body B</p>
        </FloatingCard>
      </FloatingCardProvider>,
    );

    const first = screen.getByRole('dialog', { name: 'First' });
    const second = screen.getByRole('dialog', { name: 'Second' });

    // The later card opens on top.
    expect(Number(second.style.zIndex)).toBeGreaterThan(
      Number(first.style.zIndex),
    );

    await user.pointer({ keys: '[MouseLeft]', target: first });

    expect(Number(first.style.zIndex)).toBeGreaterThan(
      Number(second.style.zIndex),
    );
  });
});
