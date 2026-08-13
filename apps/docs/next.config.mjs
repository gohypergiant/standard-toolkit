import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  cacheComponents: false,
  poweredByHeader: false,
  reactCompiler: false,
};

export default withMDX(config);
