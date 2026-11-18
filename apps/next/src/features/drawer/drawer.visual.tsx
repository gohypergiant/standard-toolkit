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

import { uuid } from '@accelint/core';
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerLayout,
  DrawerLayoutMain,
  type DrawerLayoutTracks,
  DrawerMenu,
  DrawerMenuItem,
  DrawerPanel,
  DrawerTrigger,
  DrawerView,
  Sidenav,
  ThemeProvider,
} from '@accelint/design-toolkit';
import { useMemo } from 'react';
import { describe, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  createVisualTestScenarios,
  insertModeInFilename,
  THEME_MODES,
} from '~/visual-regression/vitest';
import { type DrawerVariant, PROP_COMBOS } from './variants';

function DrawerVariantComponent({ variant }: { variant: DrawerVariant }) {
  const ids = useMemo(
    () => ({
      drawer: uuid(),
      viewA: uuid(),
      viewB: uuid(),
      viewC: uuid(),
    }),
    [],
  );
  return (
    <DrawerLayout className='bg-surface-muted relative min-h-[600px] min-w-[800px]'>
      <Drawer
        id={ids.drawer}
        placement={variant.placement}
        size='medium'
        defaultView={ids.viewA}
      >
        <DrawerMenu position={variant.menuPosition}>
          <DrawerMenuItem toggle for={ids.viewA} textValue='Item A'>
            A
          </DrawerMenuItem>
          <DrawerMenuItem toggle for={ids.viewB} textValue='Item B'>
            B
          </DrawerMenuItem>
          <DrawerMenuItem toggle for={ids.viewC} textValue='Item C'>
            C
          </DrawerMenuItem>
        </DrawerMenu>

        <DrawerPanel>
          <DrawerView id={ids.viewA}>
            <DrawerHeader>
              <DrawerHeaderTitle>
                {variant.placement} / {variant.menuPosition}
              </DrawerHeaderTitle>
              <DrawerClose for={ids.viewA} />
            </DrawerHeader>
            <DrawerContent>
              <p className='fg-primary'>
                Drawer placement: <strong>{variant.placement}</strong>
              </p>
              <p className='fg-primary'>
                Menu position: <strong>{variant.menuPosition}</strong>
              </p>
            </DrawerContent>
          </DrawerView>
          <DrawerView id={ids.viewB}>
            <DrawerHeader>
              <DrawerHeaderTitle>View B</DrawerHeaderTitle>
              <DrawerClose for={ids.viewB} />
            </DrawerHeader>
            <DrawerContent>
              <p className='fg-primary'>Content for View B</p>
            </DrawerContent>
          </DrawerView>
          <DrawerView id={ids.viewC}>
            <DrawerHeader>
              <DrawerHeaderTitle>View C</DrawerHeaderTitle>
              <DrawerClose for={ids.viewC} />
            </DrawerHeader>
            <DrawerContent>
              <p className='fg-primary'>Content for View C</p>
            </DrawerContent>
          </DrawerView>
        </DrawerPanel>
      </Drawer>

      <DrawerLayoutMain>
        <div className='flex h-full items-center justify-center'>
          Main Content Area
        </div>
      </DrawerLayoutMain>
    </DrawerLayout>
  );
}

type DrawerPlacement = keyof DrawerLayoutTracks;

type DrawerTrackCase = {
  placement: DrawerPlacement;
  configured: string;
  trackIndex: number;
};

const DRAWER_TRACK_CASES = [
  { placement: 'top', configured: '72px', trackIndex: 0 },
  { placement: 'right', configured: '180px', trackIndex: 2 },
  { placement: 'bottom', configured: '96px', trackIndex: 2 },
  { placement: 'left', configured: '240px', trackIndex: 0 },
] as const satisfies readonly DrawerTrackCase[];

function DrawerTrackFixture({
  placement,
  tracks,
  isOpen = true,
  duplicate = false,
  push,
  sidenav = false,
}: {
  placement: DrawerPlacement;
  tracks?: DrawerLayoutTracks;
  isOpen?: boolean;
  duplicate?: boolean;
  push?: DrawerPlacement;
  sidenav?: boolean;
}) {
  const ids = useMemo(
    () => ({
      drawer: uuid(),
      duplicate: uuid(),
      sidenav: uuid(),
      view: uuid(),
      duplicateView: uuid(),
    }),
    [],
  );
  const drawer = (
    <Drawer
      id={ids.drawer}
      placement={placement}
      size='medium'
      defaultView={isOpen ? ids.view : undefined}
    >
      <DrawerPanel>
        <DrawerClose aria-label={`Close ${placement}`} for={ids.drawer} />
        <DrawerView id={ids.view}>Drawer content</DrawerView>
      </DrawerPanel>
    </Drawer>
  );

  return (
    <div style={{ height: '600px', width: '800px' }}>
      <DrawerLayout
        data-testid='drawer-track-layout'
        push={push}
        tracks={tracks}
      >
        <DrawerLayoutMain>Main content</DrawerLayoutMain>
        <DrawerTrigger for={`open:${ids.view}`}>
          <Button>Open {placement}</Button>
        </DrawerTrigger>
        {sidenav ? (
          <Sidenav aria-label='Primary navigation' id={ids.sidenav} />
        ) : null}
        {drawer}
        {duplicate ? (
          <Drawer
            id={ids.duplicate}
            placement={placement}
            size='large'
            defaultView={ids.duplicateView}
          >
            <DrawerPanel>
              <DrawerView id={ids.duplicateView}>
                Duplicate drawer content
              </DrawerView>
            </DrawerPanel>
          </Drawer>
        ) : null}
      </DrawerLayout>
    </div>
  );
}

function getDrawerLayout(container: Element): HTMLElement {
  const layout = container.querySelector('[data-testid="drawer-track-layout"]');

  if (!(layout instanceof HTMLElement)) {
    throw new Error('Drawer track layout fixture did not render.');
  }

  return layout;
}

function getDrawerLayoutMain(layout: HTMLElement): HTMLElement {
  const main = layout.querySelector('main');

  if (!(main instanceof HTMLElement)) {
    throw new Error('Drawer track layout main did not render.');
  }

  return main;
}

function getMainGridColumns(main: HTMLElement): string {
  const styles = window.getComputedStyle(main);
  return `${styles.gridColumnStart} / ${styles.gridColumnEnd}`;
}

function getDrawerTrack(
  layout: HTMLElement,
  placement: DrawerPlacement,
  trackIndex: number,
): string {
  const styles = window.getComputedStyle(layout);
  const tracks =
    placement === 'top' || placement === 'bottom'
      ? styles.gridTemplateRows
      : styles.gridTemplateColumns;

  return tracks.split(' ')[trackIndex] ?? '';
}

async function expectDrawerTrack(
  layout: HTMLElement,
  placement: DrawerPlacement,
  trackIndex: number,
  track: string,
): Promise<void> {
  await expect
    .poll(() => getDrawerTrack(layout, placement, trackIndex))
    .toBe(track);
}

describe('DrawerLayout effective tracks', () => {
  test.each(DRAWER_TRACK_CASES)(
    'should resolve the configured $placement track in a fixed container',
    async ({ placement, configured, trackIndex }) => {
      const { container } = render(
        <DrawerTrackFixture
          tracks={{ [placement]: configured }}
          placement={placement}
        />,
      );
      const layout = getDrawerLayout(container);

      await expectDrawerTrack(layout, placement, trackIndex, configured);
    },
  );

  test.each(DRAWER_TRACK_CASES)(
    'should fall back to the semantic $placement track when it is not configured',
    async ({ placement, trackIndex }) => {
      const { container } = render(
        <DrawerTrackFixture placement={placement} />,
      );
      const layout = getDrawerLayout(container);

      await expectDrawerTrack(layout, placement, trackIndex, '200px');
    },
  );

  test.each(DRAWER_TRACK_CASES)(
    'should keep the configured $placement track at zero with no open Drawer',
    async ({ placement, configured, trackIndex }) => {
      const { container } = render(
        <DrawerTrackFixture
          isOpen={false}
          placement={placement}
          tracks={{ [placement]: configured }}
        />,
      );
      const layout = getDrawerLayout(container);

      await expectDrawerTrack(layout, placement, trackIndex, '0px');
    },
  );

  test.each(DRAWER_TRACK_CASES)(
    'should resolve the configured $placement track after a settled close and reopen',
    async ({ placement, configured, trackIndex }) => {
      const { container } = render(
        <DrawerTrackFixture
          tracks={{ [placement]: configured }}
          placement={placement}
        />,
      );
      const layout = getDrawerLayout(container);

      await userEvent.click(page.getByLabelText(`Close ${placement}`));
      await expectDrawerTrack(layout, placement, trackIndex, '0px');

      await userEvent.click(
        page.getByRole('button', { name: `Open ${placement}` }),
      );
      await expectDrawerTrack(layout, placement, trackIndex, configured);
    },
  );

  test.each(DRAWER_TRACK_CASES)(
    'should use one configured $placement track for concurrent same-placement Drawers',
    async ({ placement, configured, trackIndex }) => {
      const { container } = render(
        <DrawerTrackFixture
          duplicate
          placement={placement}
          tracks={{ [placement]: configured }}
        />,
      );
      const layout = getDrawerLayout(container);

      await expectDrawerTrack(layout, placement, trackIndex, configured);
    },
  );
});

describe('DrawerLayout push and overlay compatibility', () => {
  test.each([
    {
      name: 'configured push',
      push: 'right',
      track: '280px',
      tracks: { right: '280px' },
    },
    { name: 'configured overlay', track: '280px', tracks: { right: '280px' } },
    { name: 'semantic push', push: 'right', track: '200px' },
    { name: 'semantic overlay', track: '200px' },
  ] as const)(
    'should preserve $name effective track and main placement',
    async ({ push, track, tracks }) => {
      const { container } = render(
        <DrawerTrackFixture placement='right' push={push} tracks={tracks} />,
      );
      const layout = getDrawerLayout(container);
      const main = getDrawerLayoutMain(layout);

      await expectDrawerTrack(layout, 'right', 2, track);
      expect(getMainGridColumns(main)).toBe(push ? '1 / 3' : '1 / 4');
    },
  );

  test('should retain configured Drawer accessible names, keyboard operation, and visibility', async () => {
    render(
      <DrawerTrackFixture
        isOpen={false}
        placement='right'
        tracks={{ right: '280px' }}
      />,
    );

    const openButton = page.getByRole('button', { name: 'Open right' });
    const drawerContent = page.getByText('Drawer content');

    await expect.element(openButton).toBeVisible();
    await expect.element(drawerContent).not.toBeInTheDocument();

    await userEvent.tab();
    await expect.element(openButton).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    const closeButton = page.getByRole('button', { name: 'Close right' });
    await expect.element(closeButton).toBeVisible();
    await expect.element(drawerContent).toBeVisible();

    await userEvent.tab();
    await expect.element(closeButton).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    await expect.element(drawerContent).not.toBeInTheDocument();
  });

  test('should retain Sidenav reservation when a different configured Drawer is open', async () => {
    const { container } = render(
      <DrawerTrackFixture
        placement='right'
        sidenav
        tracks={{ right: '280px' }}
      />,
    );
    const layout = getDrawerLayout(container);
    const main = getDrawerLayoutMain(layout);

    await expectDrawerTrack(layout, 'left', 0, '64px');
    await expectDrawerTrack(layout, 'right', 2, '280px');
    expect(getMainGridColumns(main)).toBe('2 / 4');
    await expect
      .element(page.getByRole('navigation', { name: 'Primary navigation' }))
      .toBeVisible();
  });
});

const CONFIGURED_TRACK_VISUAL_CASES = [
  { name: 'push', push: 'right' as const },
  { name: 'overlay' },
] as const;

describe('DrawerLayout configured track visual regression', () => {
  for (const scenario of CONFIGURED_TRACK_VISUAL_CASES) {
    for (const mode of THEME_MODES) {
      const filename = insertModeInFilename(
        `drawer-layout-configured-${scenario.name}-track.png`,
        mode,
      );

      test(`should capture the configured ${scenario.name} track after a settled close and reopen (${mode} mode)`, async () => {
        const { container } = render(
          <ThemeProvider defaultMode={mode}>
            <DrawerTrackFixture
              placement='right'
              push={scenario.push}
              tracks={{ right: '280px' }}
            />
          </ThemeProvider>,
        );
        const layout = getDrawerLayout(container);

        await expectDrawerTrack(layout, 'right', 2, '280px');

        await userEvent.click(page.getByLabelText('Close right'));
        await expectDrawerTrack(layout, 'right', 2, '0px');

        await userEvent.click(page.getByRole('button', { name: 'Open right' }));
        await expectDrawerTrack(layout, 'right', 2, '280px');
        await expect.element(layout).toMatchScreenshot(filename);
      });
    }
  }
});

createVisualTestScenarios(
  'Drawer',
  PROP_COMBOS.map((variant) => ({
    name: `${variant.placement} placement, ${variant.menuPosition} menu`,
    render: () => <DrawerVariantComponent variant={variant} />,
    screenshotName: `drawer-${variant.placement}-menu-${variant.menuPosition}.png`,
    waitMs: 200,
  })),
);
