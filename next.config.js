/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
    // domains: ['localhost', 'rickandmortyapi.com', '*.googleusercontent.com'],
  },
};

module.exports = nextConfig;
