/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/cap-table' : '',
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;
