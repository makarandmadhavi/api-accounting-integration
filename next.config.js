/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        serverActions: {
          allowedOrigins: ['api-integration.makarandmadhavi.me', `localhost:${process.env.PORT || 3000}`],
          allowedForwardedHosts: ['api-integration.makarandmadhavi.me', `localhost:${process.env.PORT || 3000}`],
        },
    },
};

module.exports = nextConfig;
