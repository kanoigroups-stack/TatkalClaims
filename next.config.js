/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/blog/what-to-do-if-insurance-claim-is-rejected-complete-guide/',
        destination: '/blog/claim-rejection-guide/',
        permanent: true,
      },
      {
        source: '/blog/health-insurance-claims-experience-needs-improvement-india-survey/',
        destination: '/blog/health-insurance-claims-experience-needs-improvement-india-delays-rejections-pain-points-survey-2026/',
        permanent: true,
      },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'tatkalclaims.com',
        pathname: '/editorial/**',
      },
    ],
  },
}

module.exports = nextConfig
