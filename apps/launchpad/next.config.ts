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

import type { NextConfig } from 'next';
import Sonda from 'sonda/next';

// TODO: sync to env var
const SHOULD_PROFILE = false;

const withSondaAnalyzer = Sonda({
  detailed: true,
  enabled: SHOULD_PROFILE,
});

const nextConfig: NextConfig = {
  cleanDistDir: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: SHOULD_PROFILE,

  env: {
    // If we want we can bring in a git package to grab latest sha for local dev but there
    // really is not a need since you can check the sha locally yourself.
    // biome-ignore lint/style/useNamingConvention: global environment constant consistency
    CI_COMMIT_SHORT_SHA: process.env.CI_COMMIT_SHORT_SHA || '#####',
  },

  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },

  // NOTE: Temporary for now
  typescript: {
    ignoreBuildErrors: true,
  },

  // NOTE: we run this manually in a different script
  eslint: {
    ignoreDuringBuilds: true,
  },

  serverExternalPackages: [],

  experimental: {
    reactCompiler: true,
    // ppr: 'incremental', // Only available in canary versions
    // dynamicIO: true,
    useCache: true,
  },
};

export default withSondaAnalyzer(nextConfig);
