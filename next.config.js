/** @type {import('next.config').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }, // Allows images from any source domain safely
    ],
  },
};

module.exports = nextConfig;