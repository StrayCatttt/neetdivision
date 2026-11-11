/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: process.env.NEET_PREVIEW_BUILD === '1' ? '.next-preview' : '.next',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'utfs.io',
            }
        ],
    },
};

export default nextConfig;
