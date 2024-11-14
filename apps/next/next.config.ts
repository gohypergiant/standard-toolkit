import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import type { NextConfig } from 'next';

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  transpilePackages: ['@accelint/design-system'],

  webpack(config, { dev, nextRuntime, webpack, isServer }) {
    if (!isServer) {
      config.optimization.providedExports = true;
    }

    if (!dev) {
      config.optimization.usedExports = 'global';
    }

    if (!nextRuntime) {
      config.plugins.push(
        new webpack.BannerPlugin({
          banner: '$RefreshReg$ = () => {};\n$RefreshSig$ = () => () => {};\n',
          raw: true,
          entryOnly: true,
          include: /\.css.ts$/,
        }),
      );
    }

    return config;
  },
};

export default withVanillaExtract(nextConfig);
