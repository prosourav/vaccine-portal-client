/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  images: {
    domains: ['vaccine-app.s3.ap-south-1.amazonaws.com', 'tuk-cdn.s3.amazonaws.com','png.pngtree.com','e7.pngegg.com'],
  }
}

module.exports = nextConfig
