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

import { IconLayer, type IconLayerProps } from '@deck.gl/layers';
import ms, { type SymbolOptions } from 'milsymbol';
import type {
  AccessorContext,
  AccessorFunction,
  DefaultProps,
} from '@deck.gl/core';

const MilSymbol = ms.Symbol;

type _SymbolLayerProps<TData = unknown> = {
  /**
   * An accessor function that returns the SIDC for a given data point.
   */
  getSidc?: AccessorFunction<TData, string | number | bigint>;
  /**
   * An accessor function that returns symbol options for a given data point.
   */
  getSymbolOptions?: AccessorFunction<TData, SymbolOptions | null>;
  /**
   * Default symbol options to use when rendering symbols.
   */
  defaultSymbolOptions?: SymbolOptions;
};

export type SymbolLayerProps<TData = unknown> = _SymbolLayerProps<TData> &
  Omit<
    IconLayerProps<TData>,
    'getIcon' | 'getColor' | 'iconAtlas' | 'iconMapping'
  >;

const defaultProps: DefaultProps<SymbolLayerProps> = {
  // biome-ignore lint/suspicious/noExplicitAny: We don't know what the data type is.
  getSidc: { type: 'accessor', value: (x: any) => x.sidc },
  getSymbolOptions: { type: 'accessor', value: () => null },
  getSize: { type: 'accessor', value: 32 },
  defaultSymbolOptions: { type: 'object', value: {} },
};

/**
 * Provides a layer for rendering MIL-STD-2525 and APP-6 symbols.
 */
export class SymbolLayer<
  TData = unknown,
  // biome-ignore lint/complexity/noBannedTypes: Follows DeckGL format.
  TExtraProps extends {} = {},
> extends IconLayer<TData, TExtraProps & Required<_SymbolLayerProps<TData>>> {
  static override defaultProps = defaultProps;
  static override layerName = 'SymbolLayer';

  /**
   * The default symbol options to use when rendering symbols.
   *
   * @internal
   */
  protected defaultOptions: SymbolOptions;

  /**
   * Caches the results of the icon generation
   *
   * @internal
   * @todo Use LRU cache to limit memory usage.
   */
  protected generationCache = new Map<string, string>();

  constructor(...args: Partial<SymbolLayerProps<TData>>[]) {
    // Props are frozen after the construction
    const customGetIcons = {
      getIcon: (data: TData, info: AccessorContext<TData>) =>
        this.generateIcon(data, info),
    } as IconLayerProps<TData>;

    // biome-ignore lint/suspicious/noExplicitAny: Needed to retype the layer.
    super(...(args as any), customGetIcons as any);

    // Default options need to be set in the constructor.
    this.defaultOptions = {
      size: 100,
      colorMode: 'Dark',
      ...this.props.defaultSymbolOptions,
    };
  }

  /**
   * Generates an icon using the provided SIDC and symbol options.
   *
   * @param data A point's data
   * @param info Contextual information about the point
   * @returns DeckGL Icon Object
   */
  protected generateIcon = (data: TData, info: AccessorContext<TData>) => {
    const { getSidc, getSymbolOptions } = this.props;
    const sidc = getSidc(data, info).toString();

    let currentSymbolOptions = this.defaultOptions;

    const localOptions = getSymbolOptions(data, info);

    if (localOptions) {
      currentSymbolOptions = {
        ...currentSymbolOptions,
        ...localOptions,
      };
    }

    const size = currentSymbolOptions.size as number;

    const cacheKey = this.generateCacheKey(sidc, currentSymbolOptions);

    if (this.generationCache.has(cacheKey)) {
      const cachedUrl = this.generationCache.get(cacheKey) as string;

      return {
        id: cacheKey,
        url: cachedUrl,
        height: size,
        width: size,
      };
    }

    const dataUrl = new MilSymbol(sidc, currentSymbolOptions).toDataURL();

    this.generationCache.set(cacheKey, dataUrl);

    const returnData = {
      id: cacheKey,
      url: dataUrl,
      height: size,
      width: size,
    };

    return returnData;
  };

  /**
   * Generates a cache key for the given SIDC and symbol options.
   *
   * @param sidc SIDC of the symbol
   * @param options Options used to generate the symbol
   * @returns String key for caching
   */
  protected generateCacheKey(sidc: string, options: SymbolOptions) {
    return `${sidc}-${JSON.stringify(options)}`;
  }
}
