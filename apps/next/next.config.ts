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

    // Find the CSS loader rules
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
