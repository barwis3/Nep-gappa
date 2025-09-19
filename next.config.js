/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MAX_PEOPLE_COUNT: process.env.MAX_PEOPLE_COUNT || '50',
  },
}

module.exports = nextConfig