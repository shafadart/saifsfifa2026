/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'tv.rootitsystem.com' },
            { protocol: 'https', hostname: 'i.ibb.co.com' }
        ]
    }
};
export default nextConfig;
