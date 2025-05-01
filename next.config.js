/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    PORT: String(process.env.PORT || '3000')
  }
};

module.exports = nextConfig; 