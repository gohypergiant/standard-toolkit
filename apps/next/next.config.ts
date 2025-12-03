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

import { getLocalIdent } from '@accelint/design-foundation/lib/webpack';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import type { NextConfig } from 'next';
import type { Configuration, RuleSetRule } from 'webpack';

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  transpilePackages: ['@accelint/design-foundation', '@accelint/design-system'],
  productionBrowserSourceMaps: true,

  /**
   * ⚠️ TURBOPACK NOT SUPPORTED
   *
   * This application requires custom webpack configuration for CSS module hashing.
   * Turbopack does not support webpack config hooks, which would cause Tailwind
   * named group classes (e.g., group/button) to be incorrectly hashed, breaking
   * parent-child state styling throughout the design system.
   *
   * DO NOT use:
   * - `next dev --turbo`
   * - `experimental.turbo` config option
   *
   * Webpack will remain the bundler for this app until Turbopack supports
   * custom CSS module class name generation via a public API.
   */

  webpack(config: Configuration, { dev, nextRuntime, webpack, isServer }) {
    if (!isServer && config.optimization) {
      config.optimization.providedExports = true;
    }

    if (!dev && config.optimization) {
      config.optimization.usedExports = 'global';
    }

    if (!nextRuntime) {
      config.plugins?.push(
        new webpack.BannerPlugin({
          banner: '$RefreshReg$ = () => {};\n$RefreshSig$ = () => () => {};\n',
          raw: true,
          entryOnly: true,
          include: /\.css.ts$/,
        }),
      );
    }

    /**
     * Custom CSS Module Class Name Hashing
     *
     * Injects our custom `getLocalIdent` function into webpack's css-loader to prevent
     * hashing of Tailwind named group classes (e.g., `group/button`) while scoping all
     * other CSS module class names.
     *
     * IMPORTANT: This configuration is tested with Next.js 15.x. Future Next.js versions
     * may restructure webpack rules, requiring updates to the rule traversal logic below.
     *
     * How it works:
     * 1. Finds the webpack rule containing CSS loaders (identified by `oneOf` property)
     * 2. Iterates through each rule's loader chain
     * 3. Locates css-loader instances with CSS modules enabled
     * 4. Replaces the default getLocalIdent with our custom implementation
     *
     * See: packages/design-foundation/src/lib/webpack.ts for getLocalIdent implementation
     */
    const rules = (
      config.module?.rules?.find(
        (rule) =>
          rule != null &&
          typeof rule === 'object' &&
          typeof rule.oneOf === 'object',
      ) as RuleSetRule | undefined
    )?.oneOf?.filter(
      (rule) =>
        rule != null && typeof rule === 'object' && Array.isArray(rule.use),
    ) as RuleSetRule[] | undefined;

    rules?.forEach((rule) => {
      if (Array.isArray(rule.use)) {
        rule.use.forEach((loader) => {
          if (
            loader != null &&
            typeof loader === 'object' &&
            loader.loader &&
            loader.loader.includes('/css-loader/') &&
            loader.options &&
            typeof loader.options !== 'string' &&
            loader.options.modules
          ) {
            loader.options.modules.getLocalIdent = getLocalIdent;
          }
        });
      }
    });

    return config;
  },
};

export default withVanillaExtract(nextConfig);
