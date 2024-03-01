/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        serverActions: {
          allowedOrigins: ['https://api-integration.makarandmadhavi.me'],
        },
    },
};

module.exports = nextConfig;
