/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'rickandmortyapi.com'],
  },
};

module.exports = nextConfig;
