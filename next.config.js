/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP']
  }
};

module.exports = nextConfig; 