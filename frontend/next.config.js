/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable static export to handle dynamic routes
  // We'll deploy using Azure App Service instead of Static Web Apps
  // output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;