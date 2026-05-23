/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
     remotePatterns: [
      {
        protocol: 'https',
        hostname: 'matcha-project.s3.us-east-1.amazonaws.com',
        port: '', // Optional: leave empty for default
        pathname: '/**', // Matches all paths under the domain
      },
    ],
    // domains: ['hnco-group.s3.eu-north-1.amazonaws.com'],
    qualities: [100],
  },
  reactStrictMode: true,
  serverExternalPackages: ["svg-captcha"],
};

export default nextConfig;
