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

import type { Key } from '@react-types/shared';
import { describe, expect, it, vi } from 'vitest';
import type { TreeNode, UseTreeResult } from '../../types/use-tree';
import {
  createDragAndDropHandlers,
  getDroppedItemPayload,
  processDroppedItem,
} from './utils';

describe('tree/utils', () => {
  describe('createDragAndDropHandlers', () => {
    function setup() {
      const id = 'foo';
      const acceptedDragTypes = ['foo'];

      const lookup: Record<Key, TreeNode<unknown>> = {
        foo: {
          key: 'foo',
          children: [],
          parentKey: '',
          value: {
            id: 'foo',
            label: 'Foo',
          },
        },
        bar: {
          key: 'bar',
          children: [],
          parentKey: '',
          value: {
            id: 'bar',
            label: 'bar',
            type: 'bar',
          },
        },
        foobar: {
          key: 'foobar',
          children: [],
          parentKey: '',
          value: {
            id: 'foobar',
            label: 'foobar',
            types: ['foo', 'bar'],
          },
        },
      };

      const actions: UseTreeResult<unknown>['actions'] = {
        append: vi.fn(),
        getItem: vi.fn(),
        insert: vi.fn(),
        insertAfter: vi.fn(),
        insertBefore: vi.fn(),
        move: vi.fn(),
        prepend: vi.fn(),
        remove: vi.fn(),
        removeSelectedItems: vi.fn(),
        revertIsExpanded: vi.fn(),
        setSelectedKeys: vi.fn(),
        toggleIsExpanded: vi.fn(),
        toggleIsSelected: vi.fn(),
        toggleIsViewable: vi.fn(),
        update: vi.fn(),
      };

      return {
        acceptedDragTypes,
        actions,
        handlers: createDragAndDropHandlers(
          id,
          acceptedDragTypes,
          lookup,
          actions,
        ),
        id,
        lookup,
      };
    }

    it('should passthrough accepted drag types', () => {
      const { acceptedDragTypes, handlers } = setup();

      expect(handlers.acceptedDragTypes).toBe(acceptedDragTypes);
    });

    it('should attach getDropOperation', () => {
      const { handlers } = setup();

      expect(
        handlers.getDropOperation?.({ type: 'root' }, { has: vi.fn() }, [
          'move',
        ]),
      ).toBe('move');
    });

    it('should attach getItems', () => {
      const { handlers, lookup } = setup();

      expect(handlers.getItems?.(new Set(['foo']))).toEqual([
        { 'tree-all': JSON.stringify(lookup.foo?.value) },
      ]);

      const bar = JSON.stringify(lookup.bar?.value);

      expect(handlers.getItems?.(new Set(['bar']))).toEqual([
        { 'tree-all': bar, 'tree-bar': bar },
      ]);

      const foobar = JSON.stringify(lookup.foobar?.value);

      expect(handlers.getItems?.(new Set(['foobar']))).toEqual([
        { 'tree-all': foobar, 'tree-foo': foobar, 'tree-bar': foobar },
      ]);
    });

    it('should attach onDragEnd', () => {
      const { actions, handlers } = setup();

      handlers.onDragEnd?.({
        type: 'dragend',
        dropOperation: 'move',
        keys: new Set(),
        x: 0,
        y: 0,
        isInternal: true,
      });

      expect(actions.revertIsExpanded).toHaveBeenCalled();
    });

    it('should attach onDragStart', () => {
      const { actions, handlers } = setup();
      const keys = new Set(['foo']);

      handlers.onDragStart?.({
        type: 'dragstart',
        keys,
        x: 0,
        y: 0,
      });

      expect(actions.toggleIsExpanded).toHaveBeenCalledWith(keys, false, true);
    });

    // TODO: Test rest of handlers
  });

  describe('getDroppedItemPayload', () => {
    it('should get payload of accepted type from item', async () => {
      const payload = 'bar';

      expect(
        await getDroppedItemPayload(
          {
            kind: 'text',
            types: new Set(['foo']),
            getText: vi.fn(() => Promise.resolve(payload)),
          },
          ['foo'],
        ),
      ).toBe(payload);
    });

    it('should return error for unaccepted type item', async () => {
      await expect(
        getDroppedItemPayload(
          {
            kind: 'text',
            types: new Set(['bar']),
            getText: vi.fn(() => Promise.reject(new Error())),
          },
          ['foo'],
        ),
      ).rejects.toThrow();
    });
  });

  describe('processDroppedItem', () => {
    it('should parse JSON payload', async () => {
      const payload = '{"foo":"bar"}';

      expect(
        await processDroppedItem(
          {
            kind: 'text',
            types: new Set(['foo']),
            getText: vi.fn(() => Promise.resolve(payload)),
          },
          ['foo'],
        ),
      ).toEqual(JSON.parse(payload));
    });

    it('should throw error for empty payload', async () => {
      await expect(
        processDroppedItem(
          {
            kind: 'text',
            types: new Set(['foo']),
            getText: vi.fn(() => Promise.resolve('')),
          },
          ['foo'],
        ),
      ).rejects.toThrow();
    });
  });
});
