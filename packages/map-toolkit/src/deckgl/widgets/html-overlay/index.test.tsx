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

import { describe, expect, it, vi } from 'vitest';
import { HtmlOverlayWidget } from '.';
import type { Viewport } from '@deck.gl/core';
import type { Root } from 'react-dom/client';

function createViewport(overrides: Record<string, unknown> = {}): Viewport {
  return {
    id: 'default-view',
    width: 800,
    height: 600,
    zoom: 10,
    project: (coords: number[]) => [coords[0] ?? 0, coords[1] ?? 0],
    ...overrides,
  } as unknown as Viewport;
}

describe('HtmlOverlayWidget', () => {
  class TestableWidget extends HtmlOverlayWidget {
    setTestViewport(vp: Viewport | null): void {
      this.viewport = vp;
    }

    getReactRoot(): Root | null {
      return this.reactRoot;
    }

    getOverlayRootInit(): boolean {
      return this.overlayRootInitialized;
    }

    getInternalOverlayRoot(): unknown {
      return this.overlayRoot;
    }

    getViewportRef(): Viewport | null {
      return this.viewport;
    }
  }

  describe('onRenderHTML', () => {
    describe('root element styling', () => {
      it('should set zIndex from props', () => {
        const widget = new TestableWidget({ zIndex: 42 });
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        expect(el.style.zIndex).toBe('42');
      });

      it('should default zIndex to 1', () => {
        const widget = new TestableWidget();
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        expect(el.style.zIndex).toBe('1');
      });
    });

    describe('without viewport', () => {
      it('should pass null element to onRenderOverlay', () => {
        const onRenderOverlay = vi.fn();
        const widget = new TestableWidget({ onRenderOverlay });
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        expect(onRenderOverlay).toHaveBeenCalledWith(null, null, el);
      });

      it('should still create a React root when using default rendering', () => {
        const widget = new TestableWidget();
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        expect(widget.getReactRoot()).not.toBeNull();
      });
    });

    describe('custom overlay rendering', () => {
      it('should delegate to onRenderOverlay when provided', () => {
        const onRenderOverlay = vi.fn();
        const widget = new TestableWidget({ onRenderOverlay });
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        expect(onRenderOverlay).toHaveBeenCalledTimes(1);
      });

      it('should initialize overlay root via onCreateOverlay on first render', () => {
        const customRoot = { type: 'custom' };
        const onCreateOverlay = vi.fn().mockReturnValue(customRoot);
        const onRenderOverlay = vi.fn();
        const widget = new TestableWidget({
          onCreateOverlay,
          onRenderOverlay,
        });
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        expect(onCreateOverlay).toHaveBeenCalledTimes(1);
        expect(onCreateOverlay).toHaveBeenCalledWith(el);
        expect(onRenderOverlay).toHaveBeenCalledWith(customRoot, null, el);
      });

      it('should invoke onCreateOverlay only once across multiple renders', () => {
        const onCreateOverlay = vi.fn().mockReturnValue('root');
        const onRenderOverlay = vi.fn();
        const widget = new TestableWidget({
          onCreateOverlay,
          onRenderOverlay,
        });
        const el = document.createElement('div');

        widget.onRenderHTML(el);
        widget.onRenderHTML(el);
        widget.onRenderHTML(el);

        expect(onCreateOverlay).toHaveBeenCalledTimes(1);
        expect(onRenderOverlay).toHaveBeenCalledTimes(3);
      });

      it('should set overlay root to null when onCreateOverlay is not provided', () => {
        const onRenderOverlay = vi.fn();
        const widget = new TestableWidget({ onRenderOverlay });
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        expect(widget.getOverlayRootInit()).toBe(true);
        expect(onRenderOverlay).toHaveBeenCalledWith(null, null, el);
      });

      it('should not create a React root when onRenderOverlay is provided', () => {
        const widget = new TestableWidget({
          onRenderOverlay: vi.fn(),
        });
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        expect(widget.getReactRoot()).toBeNull();
      });

      it('should pass a non-null element when viewport exists', () => {
        const onRenderOverlay = vi.fn();
        const widget = new TestableWidget({ onRenderOverlay });
        widget.setTestViewport(createViewport());
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        const element = onRenderOverlay.mock.calls[0]?.[1];
        expect(element).not.toBeNull();
      });
    });

    describe('default React rendering', () => {
      it('should create a React root on first render', () => {
        const widget = new TestableWidget();
        const el = document.createElement('div');

        expect(widget.getReactRoot()).toBeNull();

        widget.onRenderHTML(el);

        expect(widget.getReactRoot()).not.toBeNull();
      });

      it('should reuse the same React root on subsequent renders', () => {
        const widget = new TestableWidget();
        const el = document.createElement('div');

        widget.onRenderHTML(el);
        const first = widget.getReactRoot();

        widget.onRenderHTML(el);

        expect(widget.getReactRoot()).toBe(first);
      });
    });

    describe('item projection', () => {
      it('should project items with coordinates', () => {
        const onRenderOverlay = vi.fn();
        const Item = (props: {
          coordinates: number[];
          x?: number;
          y?: number;
        }) => <div data-x={props.x} data-y={props.y} />;

        const widget = new TestableWidget({
          onRenderOverlay,
          items: <Item coordinates={[100, 200]} />,
        });
        widget.setTestViewport(createViewport());
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        const element = onRenderOverlay.mock.calls[0]?.[1];
        expect(element?.props?.children).toHaveLength(1);
      });

      it('should clone items with projected x and y props', () => {
        const onRenderOverlay = vi.fn();
        const Item = (props: {
          coordinates: number[];
          x?: number;
          y?: number;
        }) => <div data-x={props.x} data-y={props.y} />;

        const widget = new TestableWidget({
          onRenderOverlay,
          items: <Item coordinates={[150, 250]} />,
        });
        widget.setTestViewport(createViewport());
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        const projected =
          onRenderOverlay.mock.calls[0]?.[1]?.props?.children[0];
        expect(projected?.props?.x).toBe(150);
        expect(projected?.props?.y).toBe(250);
      });

      it('should exclude items without coordinates', () => {
        const onRenderOverlay = vi.fn();
        const WithCoords = (props: { coordinates: number[] }) => (
          <div data-c={props.coordinates} />
        );
        const WithoutCoords = () => <div />;

        const widget = new TestableWidget({
          onRenderOverlay,
          items: [
            <WithCoords key='a' coordinates={[100, 200]} />,
            <WithoutCoords key='b' />,
          ],
        });
        widget.setTestViewport(createViewport());
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        const element = onRenderOverlay.mock.calls[0]?.[1];
        expect(element?.props?.children).toHaveLength(1);
      });

      it('should exclude items projected outside the viewport', () => {
        const onRenderOverlay = vi.fn();
        const Item = (props: { coordinates: number[] }) => (
          <div data-c={props.coordinates} />
        );

        const widget = new TestableWidget({
          onRenderOverlay,
          items: [
            <Item key='a' coordinates={[100, 200]} />,
            <Item key='b' coordinates={[900, 200]} />,
          ],
        });
        widget.setTestViewport(createViewport({ width: 800, height: 600 }));
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        const element = onRenderOverlay.mock.calls[0]?.[1];
        expect(element?.props?.children).toHaveLength(1);
      });

      it('should include items within the overflow margin', () => {
        const onRenderOverlay = vi.fn();
        const Item = (props: { coordinates: number[] }) => (
          <div data-c={props.coordinates} />
        );

        const widget = new TestableWidget({
          onRenderOverlay,
          overflowMargin: 200,
          items: [
            <Item key='a' coordinates={[100, 200]} />,
            <Item key='b' coordinates={[900, 200]} />,
          ],
        });
        widget.setTestViewport(createViewport({ width: 800, height: 600 }));
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        const element = onRenderOverlay.mock.calls[0]?.[1];
        expect(element?.props?.children).toHaveLength(2);
      });

      it('should exclude items beyond the negative overflow boundary', () => {
        const onRenderOverlay = vi.fn();
        const Item = (props: { coordinates: number[] }) => (
          <div data-c={props.coordinates} />
        );

        const widget = new TestableWidget({
          onRenderOverlay,
          overflowMargin: 10,
          items: <Item coordinates={[-20, 300]} />,
        });
        widget.setTestViewport(createViewport());
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        const element = onRenderOverlay.mock.calls[0]?.[1];
        expect(element?.props?.children).toHaveLength(0);
      });

      it('should render an empty fragment when items is null', () => {
        const onRenderOverlay = vi.fn();
        const widget = new TestableWidget({
          onRenderOverlay,
          items: null,
        });
        widget.setTestViewport(createViewport());
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        const element = onRenderOverlay.mock.calls[0]?.[1];
        expect(element).not.toBeNull();
        expect(element?.props?.children).toHaveLength(0);
      });

      it('should handle multiple items with mixed visibility', () => {
        const onRenderOverlay = vi.fn();
        const Item = (props: { coordinates: number[] }) => (
          <div data-c={props.coordinates} />
        );

        const widget = new TestableWidget({
          onRenderOverlay,
          items: [
            <Item key='a' coordinates={[100, 100]} />,
            <Item key='b' coordinates={[-100, 100]} />,
            <Item key='c' coordinates={[400, 300]} />,
            <Item key='d' coordinates={[100, 700]} />,
          ],
        });
        widget.setTestViewport(createViewport({ width: 800, height: 600 }));
        const el = document.createElement('div');

        widget.onRenderHTML(el);

        const element = onRenderOverlay.mock.calls[0]?.[1];
        // [100,100] in view, [-100,100] out, [400,300] in view, [100,700] out
        expect(element?.props?.children).toHaveLength(2);
      });
    });
  });

  describe('onRemove', () => {
    it('should clean up React root after rendering', () => {
      const widget = new TestableWidget();
      const el = document.createElement('div');

      widget.onRenderHTML(el);
      expect(widget.getReactRoot()).not.toBeNull();

      widget.onRemove();

      expect(widget.getReactRoot()).toBeNull();
    });

    it('should reset overlay root state', () => {
      const onRenderOverlay = vi.fn();
      const onCreateOverlay = vi.fn().mockReturnValue('custom-root');
      const widget = new TestableWidget({
        onRenderOverlay,
        onCreateOverlay,
      });
      const el = document.createElement('div');

      widget.onRenderHTML(el);
      expect(widget.getOverlayRootInit()).toBe(true);

      widget.onRemove();

      expect(widget.getOverlayRootInit()).toBe(false);
      expect(widget.getInternalOverlayRoot()).toBeNull();
    });

    it('should reset viewport', () => {
      const widget = new TestableWidget();
      widget.setTestViewport(createViewport());

      widget.onRemove();

      expect(widget.getViewportRef()).toBeNull();
    });
  });
});
