/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_NN_WEBSITE_URL: process.env.NEXT_NN_WEBSITE_URL,
  },
};

export default nextConfig;
