/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // For Azure Static Web Apps compatibility
  output: 'export',
  distDir: 'out'
};

export default nextConfig;
