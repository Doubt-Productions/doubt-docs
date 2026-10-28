import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

// Static export: `next build` writes plain files to out/, which Vercel serves as they are.
const nextConfig: NextConfig = {
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: { unoptimized: true },
  poweredByHeader: false,
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Turbopack needs serialisable plugin options, so the plugin is named, not imported.
    remarkPlugins: ['remark-gfm'],
  },
});

export default withMDX(nextConfig);
